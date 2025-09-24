Company Data Extractor
Project Description

The Company Data Extractor is a full-stack application designed to fetch, verify, and manage company information efficiently. It allows users to retrieve a list of companies in a specified city and industry, along with their official websites, operational status (Active, Acquired, Closed), and location details. The system leverages OpenAI API and web scraping for high-quality, verified data collection.

The project consists of two main components:

Backend (Spring Boot + MySQL): Handles API calls, processes data, stores company information in a database, and provides endpoints for data retrieval and export.

Frontend (React): Provides a clean, interactive interface for users to search, view, and export company data. Users can also upload files (like Excel) for batch processing.

Key Features:

Fetch verified company information using OpenAI API.

Filter companies by city, industry, and operational status.

Avoid duplicate entries using internal exclusion lists.

Export company data to Excel files.

Frontend allows drag-and-drop file uploads and interactive table display.

Secure management of API keys and database credentials via environment variables.

Tech Stack
Component	Technology
Backend	Java, Spring Boot, Maven
Database	MySQL
Frontend	React, JavaScript, CSS
API Integration	OpenAI API (Responses API)
File Handling	Apache POI (Excel export)
Setup Instructions
Backend

Clone the backend repository:

git clone <backend-repo-url>
cd backend


Set environment variables for sensitive data:

export DB_USERNAME=root
export DB_PASSWORD=your_db_password
export OPENAI_API_KEY=your_openai_key


Modify application.properties to use environment variables:

spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
openai.api.key=${OPENAI_API_KEY}


Build and run the backend:

mvn clean install
mvn spring-boot:run

Frontend

Clone the frontend repository:

git clone <frontend-repo-url>
cd frontend


Install dependencies:

npm install


Start the development server:

npm start


The frontend will run at http://localhost:3000 and connect to the backend API.

Usage

Open the frontend in a browser.

Enter the city, industry, and number of companies required.

Click Fetch Companies to retrieve data.

View the company list in a table with remarks (Active, Acquired, Closed).

Export the data to Excel if needed.

Security Notes

Do not store API keys or database passwords in the repository.

Use environment variables for sensitive information.

.gitignore excludes node_modules, target, and .env files to prevent accidental uploads.

Future Enhancements

Add support for batch uploads of folders or Excel files.

Deploy backend to cloud (Heroku, AWS, Render).

Add user authentication and role-based access.

Integrate advanced filtering and analytics on company data.

License

This project is open-source and available under the MIT License.
