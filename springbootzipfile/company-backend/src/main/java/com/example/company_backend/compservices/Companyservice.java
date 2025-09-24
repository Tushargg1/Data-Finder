package com.example.company_backend.compservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.example.company_backend.entity.Company;
import com.example.company_backend.repository.CompanyRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class Companyservice {

	@Autowired
	private CompanyRepository companyRepository;

	public byte[] exportCompanyDataToExcel() {
		List<Company> companies = companyRepository.findAll();

		try (Workbook workbook = new XSSFWorkbook()) {
			Sheet sheet = workbook.createSheet("Companies");
			Row headerRow = sheet.createRow(0);

			String[] columns = { "Name", "Website", "Remark", "City", "State", "Country" };
			for (int i = 0; i < columns.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(columns[i]);
			}

			int rowNum = 1;
			for (Company company : companies) {
				Row row = sheet.createRow(rowNum++);
				row.createCell(0).setCellValue(company.getName());
				row.createCell(1).setCellValue(company.getWebsite());
				row.createCell(2).setCellValue(company.getRemark());
				row.createCell(3).setCellValue(company.getCity().getName());
				row.createCell(4).setCellValue(company.getState().getName());
				row.createCell(5).setCellValue(company.getCountry().getName());
			}

			ByteArrayOutputStream out = new ByteArrayOutputStream();
			workbook.write(out);
			return out.toByteArray();

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	
	
	public String fetchCompanyData(String city, String industry, int totalRequired) {
		int batchSize = 10; // We will ask for 10 companies at a time.

		// This list will store all the company objects we get from each API call.
		List<JsonElement> finalData = new ArrayList<>();
		// List to store just the names for preventing duplicates across batches.
		List<String> foundCompanyNames = new ArrayList<>();

		companyRepository.deleteAll(); // Clear the database once at the very beginning.

		System.out.printf("\nStarting process to find %d companies...\n", totalRequired);

		// This loop will run until we have enough companies in our finalData list.
		while (finalData.size() < totalRequired) {
			int remaining = totalRequired - finalData.size();
			int currentBatchSize = Math.min(batchSize, remaining);

			System.out.printf("\nCalling API to get %d companies... (Current total: %d)\n", currentBatchSize, finalData.size());

			// 1. Call the helper function to get a batch of companies, excluding ones we've already found.
			String batchJsonString = fetchSingleBatch(city, industry, currentBatchSize, foundCompanyNames);

			// 2. Parse the JSON string result into a JsonArray.
			JsonArray newCompanies = JsonParser.parseString(batchJsonString).getAsJsonArray();

			// If the API returns no new companies, we should stop to avoid an infinite loop.
			if (newCompanies.size() == 0) {
				System.out.println("API returned no new companies. Stopping the process.");
				break;
			}

			// 3. Add the unique companies from this batch into our finalData list.
			for (JsonElement company : newCompanies) {
				if (finalData.size() < totalRequired) {
					JsonObject companyObj = company.getAsJsonObject();
					finalData.add(company);
					foundCompanyNames.add(companyObj.get("name").getAsString());
				} else {
					break; // Stop if we have reached the total required number.
				}
			}

			System.out.printf("Success! Found %d new companies. Total is now %d.\n", newCompanies.size(), finalData.size());
		}

		// 4. After the loop is finished, combine everything into one big final list for the response.
		System.out.println("\n\n-----------------------------------------");
		System.out.println("\t\t\t Final Combined Data \t\t\t");
		System.out.println("-----------------------------------------");

		JsonArray finalJsonArray = new JsonArray();
		finalData.forEach(finalJsonArray::add);

		// Use Gson to make the final JSON look nice and pretty for the return value.
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String finalJsonOutput = gson.toJson(finalJsonArray);

		System.out.println(finalJsonOutput);
		return finalJsonOutput;
	}
	
	

	public String fetchSingleBatch(String city, String industry, int count, List<String> excludedNames) {

 	String apiKey = System.getenv("OPENAI_API_KEY");

		String formattedJson = "";
		
		
		String exclusionPrompt = "";
		if (excludedNames != null && !excludedNames.isEmpty()) {
			StringBuilder exclusionBuilder = new StringBuilder();
			exclusionBuilder.append("\n====================\n");
			exclusionBuilder.append("IMPORTANT EXCLUSION LIST\n");
			exclusionBuilder.append("====================\n");
			 exclusionBuilder.append("Your most important task is to NOT include any of the following companies:\n");
			excludedNames.forEach(name -> exclusionBuilder.append("- ").append(name).append("\n"));
			exclusionPrompt = exclusionBuilder.toString();
		}


		String prompt = String.format(
		    "<PERSONA>\n" +
		    "Your top priority is data quality. It is better to return fewer companies that are 100%% accurate and verified than to return the full requested number with errors or duplicates. Do not invent data to meet the requested count of %1$d.\n" +
		    "<PRIMARY_OBJECTIVE>\n" +
		    "Today is Monday, July 28, 2025. Your task is to return maximum up to %1$d unique, verifiable companies from the %3$s industry with a physical office located within the official city limits of %2$s.\n" +
		    "</PRIMARY_OBJECTIVE>\n\n" +

		    "<VALIDATION_STEPS>\n" +
		    "For each company you consider, you MUST follow these steps internally before including it in the output:\n" +
		    "1.  **Find Official Website:** Locate the company's primary, official website.\n" +
		    "2.  **Locate Address:** On that website, find a 'Contact', 'Locations', or 'About Us' page to locate a full, registered street address.\n" +
		    "3.  **Verify Location:** Confirm the address is geographically inside %2$s. Do not include suburbs or nearby cities.\n" +
		    "4.  **Verify Status:** Independently search reliable sources (e.g., news articles, press releases) to confirm the company's operational status (Active, Acquired, or Closed).\n" +
		    "5.  **Check Exclusion List:** Critically verify that the company is NOT on the <EXCLUSION_LIST> provided below.\n" +
		    "6.  **Final Decision:** If any step fails, you MUST discard the company. Only if all steps succeed do you format the result.\n" +
		    "</VALIDATION_STEPS>\n\n" +

		    "<OUTPUT_REQUIREMENTS>\n" +
		    "**Overall Rule:** The final JSON array must not contain any duplicate companies, either by name or by website.\n\n" +

		    "The output MUST be a valid JSON array. For each company, provide:\n" +
		    "\"name\": The exact, current legal or primary operating name.\n" +
		    "\"website\": The official, current URL. If the site is down, still provide the original URL.\n" +
		    "\"remark\": This field MUST provide context and proof. Follow these formats precisely:\n" +
		    "  - **If Active:** \"Active - Verified address at [Full Address Found on Website]\"\n" +
		    "  - **If Acquired:** \"Acquired by [Acquirer's Name] in [Year] - [Brief context, e.g., 'Website now redirects']\"\n" +
		    "  - **If Closed:** \"Closed in [Year] - [Brief context, e.g., 'Company dissolved']\"\n" +
		    "</OUTPUT_REQUIREMENTS>\n\n" +

		    "<EXAMPLES>\n" +
		    "Here are examples of a perfect output format:\n" +
		    "[\n" +
		    "  {\n" +
		    "    \"name\": \"example.\",\n" +
		    "    \"website\": \"https://www.example.com\",\n" +
		    "    \"remark\": \"Active - Verified address at example\"\n" +
		    "  },\n" +
		    "  {\n" +
		    "    \"name\": \"example (Acquired)\",\n" +
		    "    \"website\": \"http://www.example.com\",\n" +
		    "    \"remark\": \"Acquired by example in 2023 - Website now redirects to parent company\"\n" +
		    "  },\n" +
		    "  {\n" +
		    "    \"name\": \" example \",\n" +
		    "    \"website\": \"http://www.example.com\",\n" +
		    "    \"remark\": \"Closed in 2022 - Website inactive\"\n" +
		    "  }\n" +
		    "]\n" +
		    "</EXAMPLES>",
		    count, city, industry
		) + exclusionPrompt;



		// Updated tool configuration with web search
		JSONObject webSearchTool = new JSONObject();
		webSearchTool.put("type", "web_search_preview");

		// Add location context if needed
		JSONObject userLocation = new JSONObject();
		userLocation.put("type", "approximate");
		userLocation.put("city", city);

		// Include location in web search tool
		webSearchTool.put("user_location", userLocation);

		JSONArray toolsArray = new JSONArray();
		toolsArray.put(webSearchTool);

		// Use Responses API instead of Chat Completions
		JSONObject requestBodyJson = new JSONObject();
		requestBodyJson.put("model", "gpt-4.1");  // or "o4-mini"
		requestBodyJson.put("tools", toolsArray);
		requestBodyJson.put("input", prompt);  // Note: "input" instead of "messages"
		requestBodyJson.put("temperature", 0);
	    requestBodyJson.put("top_p", 0.2);

//	    System.out.println(requestBodyJson);

		try {
			 URL url = new URL("https://api.openai.com/v1/responses");
//			URL url = new URL("https://api.openai.com/v1/chat/completions");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer " + apiKey);
			conn.setRequestProperty("Content-Type", "application/json");
			conn.setDoOutput(true);

			try (OutputStream os = conn.getOutputStream()) {
				os.write(requestBodyJson.toString().getBytes());
			}

			int responseCode = conn.getResponseCode();
			System.out.println(" Server Response : " + responseCode);

			InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();
			BufferedReader in = new BufferedReader(new InputStreamReader(is));
			String inputLine;
			StringBuilder responseText = new StringBuilder();

			while ((inputLine = in.readLine()) != null) {
				responseText.append(inputLine);
			}
			in.close();

//			System.out.println(responseText);
			formattedJson = extractAiData(responseText);

		} catch (Exception e) {
			System.out.println("❌ Error while processing:");
			e.printStackTrace();
			formattedJson = "{}";

		}
		return formattedJson;

	}

	public String extractAiData(StringBuilder responseText) {
		System.out.println(responseText);

		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		JsonObject fullJson = JsonParser.parseString(responseText.toString()).getAsJsonObject();

		String formattedJson = "[]"; // Default to empty array
		String rawText = null;

		// Determine the source of the content based on API response structure
		if (fullJson.has("choices")) {
			JsonArray choices = fullJson.getAsJsonArray("choices");
			if (choices != null && choices.size() > 0) {
				JsonObject firstChoice = choices.get(0).getAsJsonObject();
				JsonObject messageObjResp = firstChoice.getAsJsonObject("message");
				if (messageObjResp != null && messageObjResp.has("content")) {
					rawText = messageObjResp.get("content").getAsString().trim();
				}
			}
		} else if (fullJson.has("output")) {
			JsonArray outputArray = fullJson.getAsJsonArray("output");
			for (int i = outputArray.size() - 1; i >= 0; i--) {
				JsonObject item = outputArray.get(i).getAsJsonObject();
				if (item.get("type").getAsString().equals("message")) {
					JsonArray contentArray = item.getAsJsonArray("content");
					for (JsonElement el : contentArray) {
						JsonObject contentObj = el.getAsJsonObject();
						if (contentObj.has("type") && contentObj.get("type").getAsString().equals("output_text")
								&& contentObj.has("text")) {
							rawText = contentObj.get("text").getAsString().trim();
							break;
						}
					}
					break;
				}
			}
		} else {
			System.out.println("❌ Neither 'choices' nor 'output' found in response.");
			return "{}";
		}
		
		// *** CODE ADDED AS PER YOUR REQUEST STARTS HERE ***
		if (rawText != null) {
			// Remove code block formatting
			if (rawText.startsWith("```json")) {
				rawText = rawText.replaceFirst("```json", "").trim();
			}
			if (rawText.endsWith("```")) {
				rawText = rawText.substring(0, rawText.length() - 3).trim();
			}

			try {
				// Parse the full, valid JSON
				JsonElement parsedElement = JsonParser.parseString(rawText);
				formattedJson = gson.toJson(parsedElement);
				
				// Save the parsed companies to the database
				saveCompaniesFromJson(parsedElement);

			} catch (Exception e) {
				// If parsing fails, try to recover partial data from an incomplete array
				String trimmed = trimIncompleteJsonArray(rawText);
				try {
					JsonElement parsedElement = JsonParser.parseString(trimmed);
					formattedJson = gson.toJson(parsedElement);
					System.out.println("✅ Trimmed broken JSON and recovered partial data.");

					// Save the recovered companies to the database
					saveCompaniesFromJson(parsedElement);
					
					if (parsedElement.isJsonArray()) {
						System.out.println("Recovered " + parsedElement.getAsJsonArray().size() + " valid companies after trimming broken data.");
					}

				} catch (Exception e2) {
					System.out.println("❌ Unable to parse trimmed JSON.");
					formattedJson = "[]"; 
				}
			}
		}

		return formattedJson;
	}

	private void saveCompaniesFromJson(JsonElement parsedElement) {
		if (parsedElement.isJsonArray()) {
			JsonArray companyArray = parsedElement.getAsJsonArray();
			List<Company> companiesToSave = new ArrayList<>();

			for (JsonElement companyElement : companyArray) {
				JsonObject companyObj = companyElement.getAsJsonObject();
				Company company = new Company();
				company.setName(companyObj.get("name").getAsString());
				company.setWebsite(companyObj.get("website").getAsString());
				company.setRemark(companyObj.get("remark").getAsString());
				companiesToSave.add(company);
			}

			companyRepository.saveAll(companiesToSave);
			System.out.println("✅ Successfully saved " + companiesToSave.size() + " companies to the database.");
		}
	}


	public static String trimIncompleteJsonArray(String raw) {
		int arrayStart = raw.indexOf('[');
		int lastObjEnd = raw.lastIndexOf('}');
		if (arrayStart < 0 || lastObjEnd < 0 || lastObjEnd < arrayStart) {
			return "[]";
		}
		String trimmed = raw.substring(arrayStart, lastObjEnd + 1) + "]";
		return trimmed;
	}
}