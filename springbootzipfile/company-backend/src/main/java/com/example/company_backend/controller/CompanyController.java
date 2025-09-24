package com.example.company_backend.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.company_backend.compservices.Companyservice;


@RestController
@CrossOrigin(origins = "*")
//@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private Companyservice companyService;

    @GetMapping("/companies")
    public ResponseEntity<String> getCompanyData(
            @RequestParam String city,
            @RequestParam String industry,
            @RequestParam int count) {

        String resultJson = companyService.fetchCompanyData(city, industry, count);
        return ResponseEntity.ok(resultJson);
    }
    
    
    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportToExcel(
    		@RequestParam String city,
    		@RequestParam String industry,
            @RequestParam int count
       ) {
    	

        byte[] excelData = companyService.exportCompanyDataToExcel();

        String formattedIndustry = industry.replaceAll("\\s+", "_");
        String formattedCity = city.replaceAll("\\s+", "_");
        String filename = count + "_" + formattedIndustry + "_companies_in_" + formattedCity + ".xlsx";

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(excelData);
    }


}
