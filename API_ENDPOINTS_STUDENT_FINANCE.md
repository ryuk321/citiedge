# Student Finance API Endpoints Reference

Quick reference for all API endpoints required for the Student Finance system.

---

## 📡 Base Configuration

```typescript
const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// All requests should include:
headers: {
  "X-API-KEY": API_KEY,
  "Content-Type": "application/json"
}
```

---

## 🎓 Qualifications Endpoints

### 1. Get All Qualifications

**GET** `/student_api.php?action=getStudentFinanceQualifications`

Optional parameters:
- `active=true` - Only return active records

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "subject_name": "Law",
      "subject_slug": "law",
      "category": "Legal Studies",
      "level_6_title": "LLB (Bachelor of Laws)",
      "level_6_qualification": "Level 6: LLB (Bachelor of Laws)",
      "level_6_finance_eligible": true,
      "level_7_title": "LLM (Master of Laws)",
      "level_7_qualification": "Level 7: LLM (Master of Laws)",
      "level_7_finance_eligible": true,
      "level_8_title": "PhD in Law",
      "level_8_qualification": "Level 8: PhD in Law",
      "level_8_finance_eligible": true,
      "professional_route": "LLB → SQE → Solicitor / Barrister",
      "is_regulated": false,
      "regulatory_body": "Solicitors Regulation Authority (SRA)",
      "special_notes": "All levels eligible for Student Finance England",
      "display_order": 1,
      "is_active": true,
      "created_at": "2025-12-27 10:00:00",
      "updated_at": "2025-12-27 10:00:00"
    }
  ]
}
```

### 2. Add New Qualification

**POST** `/student_api.php?action=addFinanceQualification`

**Request Body:**
```json
{
  "subject_name": "Law",
  "subject_slug": "law",
  "category": "Legal Studies",
  "level_6_title": "LLB (Bachelor of Laws)",
  "level_6_qualification": "Level 6: LLB (Bachelor of Laws)",
  "level_6_finance_eligible": true,
  "level_7_title": "LLM (Master of Laws)",
  "level_7_qualification": "Level 7: LLM (Master of Laws)",
  "level_7_finance_eligible": true,
  "level_8_title": "PhD in Law",
  "level_8_qualification": "Level 8: PhD in Law",
  "level_8_finance_eligible": true,
  "professional_route": "LLB → SQE → Solicitor / Barrister",
  "is_regulated": false,
  "regulatory_body": "Solicitors Regulation Authority (SRA)",
  "special_notes": "All levels eligible for Student Finance England",
  "display_order": 1,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "id": 17
}
```

### 3. Update Qualification

**POST** `/student_api.php?action=updateFinanceQualification`

**Request Body:**
```json
{
  "id": 1,
  "subject_name": "Law (Updated)",
  "subject_slug": "law",
  // ... all other fields
}
```

**Response:**
```json
{
  "success": true
}
```

### 4. Delete Qualification

**POST** `/student_api.php?action=deleteFinanceQualification`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 📋 General Information Endpoints

### 5. Get All General Information

**GET** `/student_api.php?action=getStudentFinanceGeneral`

Optional parameters:
- `active=true` - Only return active records

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "section_title": "Student Finance England - Quick Rule",
      "section_slug": "sfe-quick-rule",
      "section_type": "funding_rules",
      "content": "Level 1-3: ❌ Not funded by SFE\nLevel 4-6: ✅ Undergraduate Loan\nLevel 7: ✅ Postgraduate Master's Loan\nLevel 8: ✅ Doctoral Loan (exceptions apply)",
      "content_html": null,
      "display_order": 1,
      "is_active": true,
      "icon": "info",
      "color_code": "#3B82F6",
      "created_at": "2025-12-27 10:00:00",
      "updated_at": "2025-12-27 10:00:00"
    }
  ]
}
```

### 6. Add General Information

**POST** `/student_api.php?action=addFinanceGeneralInfo`

**Request Body:**
```json
{
  "section_title": "Important Notice",
  "section_slug": "important-notice",
  "section_type": "important_note",
  "content": "Always check with Student Finance England for the most current information.",
  "display_order": 4,
  "is_active": true,
  "icon": "warning",
  "color_code": "#F59E0B"
}
```

**Section Types:**
- `funding_rules` - Information about funding levels
- `progression_chart` - Academic progression information
- `general_info` - General information sections
- `important_note` - Important notices and warnings

**Response:**
```json
{
  "success": true,
  "id": 4
}
```

### 7. Update General Information

**POST** `/student_api.php?action=updateFinanceGeneralInfo`

**Request Body:**
```json
{
  "id": 1,
  "section_title": "Updated Title",
  "section_slug": "updated-slug",
  // ... all other fields
}
```

**Response:**
```json
{
  "success": true
}
```

### 8. Delete General Information

**POST** `/student_api.php?action=deleteFinanceGeneralInfo`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 🧪 Testing with cURL

### Test Get Qualifications
```bash
curl -H "X-API-KEY: your_key_here" \
  "https://citiedgecollege.co.uk/student_api.php?action=getStudentFinanceQualifications"
```

### Test Add Qualification
```bash
curl -X POST \
  -H "X-API-KEY: your_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "subject_name": "Test Subject",
    "subject_slug": "test-subject",
    "category": "Test",
    "level_6_title": "Test BSc",
    "level_6_qualification": "Test Level 6",
    "level_6_finance_eligible": true,
    "level_7_title": "Test MSc",
    "level_7_qualification": "Test Level 7",
    "level_7_finance_eligible": true,
    "level_8_title": "Test PhD",
    "level_8_qualification": "Test Level 8",
    "level_8_finance_eligible": true,
    "professional_route": "BSc → MSc → PhD",
    "is_regulated": false,
    "regulatory_body": "",
    "special_notes": "",
    "display_order": 99,
    "is_active": true
  }' \
  "https://citiedgecollege.co.uk/student_api.php?action=addFinanceQualification"
```

### Test Get General Info
```bash
curl -H "X-API-KEY: your_key_here" \
  "https://citiedgecollege.co.uk/student_api.php?action=getStudentFinanceGeneral&active=true"
```

---

## 🔒 Error Handling

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common error scenarios:
- Missing API key: `401 Unauthorized`
- Invalid data: `400 Bad Request`
- Database error: Return `success: false` with error message
- Not found: `404 Not Found`

---

## 📊 Data Types Reference

### Qualification Object
```typescript
interface QualificationData {
  id: number;
  subject_name: string;          // Required
  subject_slug: string;          // Required, unique
  category: string;              // Default: "General"
  level_6_title: string;
  level_6_qualification: string;
  level_6_finance_eligible: boolean;  // Default: true
  level_7_title: string;
  level_7_qualification: string;
  level_7_finance_eligible: boolean;  // Default: true
  level_8_title: string;
  level_8_qualification: string;
  level_8_finance_eligible: boolean;  // Default: true
  professional_route: string;
  is_regulated: boolean;         // Default: false
  regulatory_body: string;
  special_notes: string;
  display_order: number;         // Default: 0
  is_active: boolean;            // Default: true
  created_at: string;            // Auto-generated
  updated_at: string;            // Auto-updated
}
```

### General Info Object
```typescript
interface GeneralInfoData {
  id: number;
  section_title: string;         // Required
  section_slug: string;          // Required, unique
  section_type: 'funding_rules' | 'progression_chart' | 'general_info' | 'important_note';  // Required
  content: string;               // Required
  content_html: string;          // Optional
  display_order: number;         // Default: 0
  is_active: boolean;            // Default: true
  icon: string;                  // Default: "info"
  color_code: string;            // Default: "#3B82F6"
  created_at: string;            // Auto-generated
  updated_at: string;            // Auto-updated
}
```

---

## 🎯 Frontend Usage Examples

### Using in React Component

```typescript
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

// Fetch qualifications
const loadQualifications = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=getStudentFinanceQualifications&active=true`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    const result = await response.json();
    if (result.success) {
      setQualifications(result.data);
    }
  } catch (error) {
    console.error("Failed to load qualifications:", error);
  }
};

// Add qualification
const addQualification = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=addFinanceQualification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result.success) {
      alert("Added successfully!");
      loadQualifications();
    }
  } catch (error) {
    console.error("Failed to add qualification:", error);
  }
};
```

---

## 📝 Notes

- All boolean values must be properly converted in PHP (use `(bool)`)
- Always order by `display_order ASC, id ASC` for consistent ordering
- The `active=true` parameter is case-sensitive
- API_KEY must be included in all requests
- Content type must be `application/json` for POST requests
- Subject slugs should be URL-friendly (lowercase, hyphens, no spaces)

---

**Last Updated**: December 27, 2025
**API Version**: 1.0
