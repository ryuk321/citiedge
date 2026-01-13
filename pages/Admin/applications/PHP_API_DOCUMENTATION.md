# Applications API - PHP Backend Documentation

## Overview

The `student_api.php` file has been updated with complete CRUD operations for the Applications Management system. All endpoints follow RESTful conventions and integrate with the `applications` database table.

## 🔧 Setup Requirements

### 1. Database Configuration
Ensure your database connection settings are correct in `student_api.php`:
```php
$host = "localhost";
$db   = "citiedge_portal";
$user = "citiedge_portal";
$pass = "your_password_here";
```

### 2. API Key Authentication
All requests must include the API key header:
```
X-API-KEY: super-secret-key
```

### 3. Create Applications Table
Run the SQL script to create the applications table:
```bash
mysql -u citiedge_portal -p citiedge_portal < Database\ Instruction/create_applications_table.sql
```

## 📡 API Endpoints

### 1. Get Applications (Paginated)
**Endpoint:** `GET /student_api.php?action=getApplications`

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 10)
- `search` (string, optional): Search term for name, email, or programme
- `status` (string, optional): Filter by status (pending, under_review, accepted, rejected, withdrawn, deferred)

**Example Request:**
```bash
curl -X GET "http://localhost/student_api.php?action=getApplications&page=1&limit=10&search=John&status=pending" \
  -H "X-API-KEY: super-secret-key"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "programme": "BSc Computer Science",
      "status": "pending",
      "submissionDate": "2026-01-12 10:30:00",
      "isAgentApplication": "No",
      "agentCompany": null,
      "agentName": null,
      "agentEmail": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 2. Get Application Statistics
**Endpoint:** `GET /student_api.php?action=getApplicationStatistics`

**Example Request:**
```bash
curl -X GET "http://localhost/student_api.php?action=getApplicationStatistics" \
  -H "X-API-KEY: super-secret-key"
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total": 50,
    "pending": 15,
    "under_review": 20,
    "accepted": 10,
    "rejected": 5,
    "agent_applications": 30,
    "direct_applications": 20
  },
  "agentStatistics": [
    {
      "agentCompany": "Global Education Partners",
      "agentName": "Sarah Johnson",
      "agentEmail": "sarah@globaledu.com",
      "applications_count": 12
    }
  ]
}
```

---

### 3. Get Application by ID
**Endpoint:** `GET /student_api.php?action=getApplicationById&id={id}`

**Query Parameters:**
- `id` (int, required): Application ID

**Example Request:**
```bash
curl -X GET "http://localhost/student_api.php?action=getApplicationById&id=1" \
  -H "X-API-KEY: super-secret-key"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "programme": "BSc Computer Science",
    "status": "pending",
    "submissionDate": "2026-01-12 10:30:00",
    ... // All other fields
  }
}
```

---

### 4. Create Application
**Endpoint:** `POST /student_api.php?action=createApplication`

**Request Body:** JSON object with application data

**Required Fields:**
- `firstName` (string)
- `lastName` (string)
- `email` (string)
- `programme` (string)

**Example Request:**
```bash
curl -X POST "http://localhost/student_api.php?action=createApplication" \
  -H "X-API-KEY: super-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "programme": "BSc Computer Science",
    "phone": "+447123456789",
    "nationality": "British",
    "status": "pending",
    "isAgentApplication": "No"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Application created successfully",
  "id": 1
}
```

---

### 5. Update Application
**Endpoint:** `POST /student_api.php?action=updateApplication`

**Request Body:** JSON object with fields to update (must include `id`)

**Example Request:**
```bash
curl -X POST "http://localhost/student_api.php?action=updateApplication" \
  -H "X-API-KEY: super-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "under_review",
    "notes": "Application being reviewed by admission team",
    "assignedTo": "admin@citiedge.ac.uk"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Application updated successfully"
}
```

---

### 6. Delete Application
**Endpoint:** `GET /student_api.php?action=deleteApplication&id={id}`

**Query Parameters:**
- `id` (int, required): Application ID to delete

**Example Request:**
```bash
curl -X GET "http://localhost/student_api.php?action=deleteApplication&id=1" \
  -H "X-API-KEY: super-secret-key"
```

**Response:**
```json
{
  "success": true,
  "message": "Application deleted successfully",
  "deleted": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### 7. Update Application Status
**Endpoint:** `POST /student_api.php?action=updateApplicationStatus`

**Request Body:**
```json
{
  "id": 1,
  "status": "accepted",
  "notes": "Congratulations! Your application has been accepted.",
  "assignedTo": "admin@citiedge.ac.uk"
}
```

**Valid Status Values:**
- `pending`
- `under_review`
- `accepted`
- `rejected`
- `withdrawn`
- `deferred`

**Example Request:**
```bash
curl -X POST "http://localhost/student_api.php?action=updateApplicationStatus" \
  -H "X-API-KEY: super-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "accepted",
    "notes": "Application approved"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated successfully"
}
```

---

## 🔍 Integration with Next.js API Routes

The Next.js API routes in `pages/api/applications/` act as proxies to the PHP backend:

### Files Updated:
1. **`pages/api/applications/get-applications.ts`**
   - Proxies requests to PHP `getApplications` endpoint
   - Handles pagination and filtering

2. **`pages/api/applications/applications.ts`**
   - Handles GET (statistics), DELETE, and PUT operations
   - Routes requests to appropriate PHP endpoints

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
API_KEY=super-secret-key
```

---

## 🐛 Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `403` - Forbidden (invalid API key)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## 🔐 Security Features

1. **API Key Authentication**: All requests require valid API key
2. **CORS Headers**: Configured for cross-origin requests
3. **Input Validation**: All inputs are validated before processing
4. **Prepared Statements**: All SQL queries use PDO prepared statements to prevent SQL injection
5. **Error Logging**: Errors are logged to `api_error.log`

---

## 📝 Testing

### Using cURL:

```bash
# Test API connection
curl -X GET "http://localhost/student_api.php?action=test" \
  -H "X-API-KEY: super-secret-key"

# Get applications
curl -X GET "http://localhost/student_api.php?action=getApplications&page=1&limit=5" \
  -H "X-API-KEY: super-secret-key"

# Get statistics
curl -X GET "http://localhost/student_api.php?action=getApplicationStatistics" \
  -H "X-API-KEY: super-secret-key"
```

### Using Postman:

1. Import the collection (see postman_collection.json in docs folder)
2. Set the `X-API-KEY` header
3. Configure the base URL
4. Run the requests

---

## 📊 Database Schema

The applications table includes all fields from the `ApplicationLead` interface in `DB_Table.ts`:

- Personal Information (name, DOB, gender, nationality, etc.)
- Contact Information (email, phone, address, etc.)
- Course Selection (programme, intake, study mode, etc.)
- Academic History (up to 3 institutions)
- English Proficiency
- Employment History (up to 2 employers)
- References (2 referees)
- Funding & Scholarships
- Agent Information (if agent application)
- Additional Information (disability, criminal conviction, etc.)
- Declaration & Signature
- Status & Metadata

See `create_applications_table.sql` for the complete schema.

---

## 🚀 Performance Optimization

1. **Indexed Fields**: Key fields (email, status, dates) are indexed
2. **Pagination**: Prevents loading large datasets
3. **Prepared Statements**: Reusable query execution
4. **Conditional Queries**: Only fetches required data

---

## 📖 Additional Resources

- [DB_Table.ts](../lib/DB_Table.ts) - TypeScript interfaces
- [create_applications_table.sql](../Database%20Instruction/create_applications_table.sql) - SQL schema
- [IMPLEMENTATION_SUMMARY.md](../pages/Admin/applications/IMPLEMENTATION_SUMMARY.md) - Frontend implementation
- [README.md](../pages/Admin/applications/README.md) - Complete system documentation

---

**Last Updated:** January 12, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
