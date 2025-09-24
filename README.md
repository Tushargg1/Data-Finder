# Company Data Extractor

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![OpenAI API](https://img.shields.io/badge/OpenAI-API-purple.svg)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack application designed to fetch, verify, and manage company information efficiently using AI-powered data extraction and web scraping technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Security](#security)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Support](#support)

## 🌟 Overview

The Company Data Extractor is a comprehensive solution for businesses and researchers who need to collect and verify company information at scale. The application combines the power of OpenAI's API with intelligent web scraping to provide high-quality, verified company data including operational status, location details, and official websites.

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄──►│ Spring Boot API │◄──►│   MySQL Database│
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   OpenAI API    │
                       │   Integration   │
                       └─────────────────┘
```

## ✨ Features

- **🔍 Intelligent Data Extraction**: Leverage OpenAI API for accurate company information retrieval
- **🌍 Location-Based Search**: Filter companies by city and industry
- **✅ Verification System**: Verify company operational status (Active, Acquired, Closed)
- **🚫 Duplicate Prevention**: Built-in exclusion lists to avoid duplicate entries
- **📊 Excel Export**: Export company data to Excel files for further analysis
- **📁 File Upload**: Drag-and-drop interface for batch processing
- **⚡ Real-time Processing**: Interactive table display with real-time updates
- **🔒 Secure**: Environment-based configuration for sensitive data

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Java 17, Spring Boot 3.5.3, Maven |
| **Database** | MySQL 8.0 |
| **Frontend** | React 18.x, JavaScript ES6+, CSS3 |
| **API Integration** | OpenAI API (GPT Models) |
| **File Processing** | Apache POI (Excel export/import) |
| **Build Tools** | Maven (Backend), npm (Frontend) |
| **Security** | Environment Variables, Spring Security |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17+**
- **Node.js 16+ and npm**
- **MySQL 8.0+**
- **Maven 3.8+**
- **OpenAI API Key** (obtain from [OpenAI Platform](https://platform.openai.com/))

## 🚀 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/company-data-extractor-backend.git
   cd company-data-extractor-backend
   ```

2. **Set up the database**
   ```sql
   CREATE DATABASE company_extractor;
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON company_extractor.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure environment variables**
   ```bash
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   export OPENAI_API_KEY=your_openai_api_key
   ```

4. **Build and run the application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8081`

### Frontend Setup

1. **Clone the frontend repository**
   ```bash
   git clone https://github.com/yourusername/company-data-extractor-frontend.git
   cd company-data-extractor-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

```properties
# Application
spring.application.name=company-data-extractor
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/company_extractor?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.open-in-view=false

# OpenAI API Configuration
openai.api.key=${OPENAI_API_KEY}
openai.api.timeout=30000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Environment Variables

Create a `.env` file in your project root (for development):

```bash
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
OPENAI_API_KEY=sk-your-openai-api-key
```

## 📖 Usage

### Basic Workflow

1. **Start the Application**
   - Ensure both backend and frontend are running
   - Navigate to `http://localhost:3000`

2. **Search for Companies**
   - Enter the target city (e.g., "San Francisco")
   - Specify the industry (e.g., "Software")
   - Set the number of companies to fetch
   - Click "Fetch Companies"

3. **View Results**
   - Browse companies in the interactive table
   - View operational status (Active, Acquired, Closed)
   - Check company websites and locations

4. **Export Data**
   - Click "Export to Excel" to download results
   - Use the exported file for further analysis

### File Upload Feature

- **Drag and Drop**: Simply drag Excel files onto the upload area
- **Batch Processing**: Upload multiple company lists for processing
- **Format Support**: Supports `.xlsx` and `.xls` formats

## 🔌 API Documentation

### Main Endpoints

#### Fetch Companies
```http
POST /api/companies/fetch
Content-Type: application/json

{
  "city": "San Francisco",
  "industry": "Software",
  "count": 50
}
```

#### Get All Companies
```http
GET /api/companies
```

#### Export to Excel
```http
GET /api/companies/export?city=San Francisco&industry=Software
```

#### Upload File
```http
POST /api/companies/upload
Content-Type: multipart/form-data

{
  "file": [Excel file]
}
```

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Example Corp",
      "website": "https://example.com",
      "status": "Active",
      "city": "San Francisco",
      "industry": "Software",
      "createdAt": "2025-09-24T19:30:00Z"
    }
  ],
  "total": 1,
  "message": "Companies fetched successfully"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- **Backend**: Follow Java naming conventions and Spring Boot best practices
- **Frontend**: Use ESLint and Prettier for consistent formatting
- **Database**: Use meaningful table and column names
- **Comments**: Write clear, concise comments for complex logic

## 🔒 Security

- **Environment Variables**: All sensitive data is stored in environment variables
- **API Key Protection**: OpenAI API keys are never exposed in client-side code
- **Database Security**: Use strong passwords and limit database access
- **Input Validation**: All user inputs are validated and sanitized
- **CORS Configuration**: Properly configured for production deployments

### Security Checklist

- [ ] API keys stored in environment variables
- [ ] Database credentials secured
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] HTTPS in production

## 🚀 Future Enhancements

### Planned Features

- [ ] **User Authentication**: JWT-based authentication system
- [ ] **Role-Based Access Control**: Different permission levels
- [ ] **Advanced Analytics**: Company data insights and trends
- [ ] **Bulk Operations**: Process thousands of companies simultaneously
- [ ] **API Rate Limiting**: Prevent abuse and ensure fair usage
- [ ] **Caching System**: Redis integration for better performance
- [ ] **Monitoring**: Application performance monitoring
- [ ] **Docker Support**: Containerization for easy deployment

### Cloud Deployment Options

- **Backend**: AWS EC2, Heroku, Google Cloud Platform
- **Database**: AWS RDS, Google Cloud SQL
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Company Data Extractor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 💬 Support

### Getting Help

- **Documentation**: Check our [Wiki](https://github.com/yourusername/company-data-extractor/wiki) for detailed guides
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/yourusername/company-data-extractor/issues)
- **Discussions**: Join the community in [GitHub Discussions](https://github.com/yourusername/company-data-extractor/discussions)

### Contact

- **Email**: support@companydataextractor.com
- **Twitter**: [@CompanyDataExt](https://twitter.com/companydataext)
- **LinkedIn**: [Company Data Extractor](https://linkedin.com/company/company-data-extractor)

---

<div align="center">

**[⬆ Back to Top](#company-data-extractor)**

Made with ❤️ by the Company Data Extractor Team

[![GitHub stars](https://img.shields.io/github/stars/yourusername/company-data-extractor.svg?style=social)](https://github.com/yourusername/company-data-extractor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/company-data-extractor.svg?style=social)](https://github.com/yourusername/company-data-extractor/network/members)

</div>
