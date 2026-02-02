# Agent Application File Upload Integration

## Overview
This document describes the complete integration of file upload functionality and database synchronization for agent-submitted applications.

## What Has Been Implemented

### 1. PHP Backend (agent_api.php)

#### File Upload Function
```php
saveApplicationFiles($files, $first_name, $last_name, $passport)
```
- Creates folder structure: `uploads/applications/LASTNAME-FIRSTNAME-PASSPORT/`
- Saves files with unique timestamps
- Returns array of saved file paths
- Validates file size (10MB max per file)
- Validates file types (PDF, JPG, PNG, DOC, DOCX)

#### Updated `createAgentApplication` Case
Now handles:
- **Multipart form data** (with files)
- **Dual database insertion**:
  1. **agent_applications table** - For agent tracking
  2. **applications table** - Main admissions database
- **Transaction support** - Rollback if either insert fails
- **File upload integration**
- **Commission calculation**
- **Agent statistics updates**
- **Notification creation**

### 2. Next.js API Endpoint (pages/api/agent/applications.ts)

- Disabled default body parser
- Uses `formidable` to parse multipart form data
- Forwards files and data to PHP API
- Cleans up temporary files after upload
- Returns success/error responses

### 3. Frontend Components

#### agentData.ts
- Updated `createApplication()` to accept optional `File[]` parameter
- Handles FormData submission for file uploads
- Falls back to JSON for non-file submissions

#### ApplicationUploadForm.tsx
- Added file input handler
- Shows list of uploaded files
- Allows removing files before submission
- Displays file names and sizes
- Validates files client-side

## Required Setup Steps

### 1. Install NPM Dependencies

```bash
npm install formidable
npm install form-data
npm install @types/formidable --save-dev
npm install @types/form-data --save-dev
```

### 2. Create Upload Directory

```bash
# On Windows (PowerShell)
New-Item -Path "c:\Users\loken\Documents\CITIEDGE\citiedg-portals\public_html\uploads\applications" -ItemType Directory -Force

# On Linux/Mac
mkdir -p /path/to/citiedg-portals/public_html/uploads/applications
chmod 755 /path/to/citiedg-portals/public_html/uploads/applications
```

Make sure the web server (Apache/Nginx) has write permissions to this directory.

### 3. Update Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_AGENT_API_URL=https://citiedgecollege.co.uk/agent_api.php
```

### 4. Database Schema Verification

Ensure both tables exist with correct structure:

#### agent_applications table
```sql
-- Already exists with correct fields
```

#### applications table
```sql
-- Run the SQL script if not already created:
-- Database Instruction/create_applications_table.sql
```

## Data Flow

### Application Submission Process

```
1. User fills form in ApplicationUploadForm.tsx
   └─> Selects files to upload
   
2. Form submits to /api/agent/applications (POST)
   └─> Next.js parses multipart data with formidable
   └─> Forwards to PHP agent_api.php
   
3. PHP agent_api.php (createAgentApplication)
   ├─> Validates required fields
   ├─> Uploads files with saveApplicationFiles()
   ├─> BEGIN TRANSACTION
   ├─> INSERT into agent_applications table
   ├─> INSERT into applications table
   ├─> UPDATE agent statistics
   ├─> CREATE notification
   └─> COMMIT TRANSACTION
   
4. Success response returned to frontend
   └─> User sees success message
   └─> Portal refreshes with new application
```

## Database Synchronization

### What Gets Inserted Where

#### agent_applications table (Agent Tracking)
- `application_id` - Unique ID (APP-YYYY-XXXXXX)
- `agent_id` - References agent
- Student basic info (name, email, phone)
- Programme and course details
- Status tracking
- Commission calculations
- `application_data` - Full JSON dump
- `documents_uploaded` - Count of files

#### applications table (Main Admissions)
- All student personal information
- Course selection details
- Academic history (up to 3 qualifications)
- English proficiency
- Employment history (up to 2 jobs)
- References (2 references)
- Funding information
- Agent information (`is_agent_application='Yes'`)
- Additional info (disability, criminal conviction)
- `file_paths` - JSON array of uploaded files
- Status ('pending')

## File Storage Structure

```
public_html/
└── uploads/
    └── applications/
        └── SMITH-JOHN-AB123456/
            ├── PASSPORT_1706544123_65b8c3f7a1234.pdf
            ├── TRANSCRIPT_1706544125_65b8c3f9b5678.pdf
            └── ENGLISHTEST_1706544127_65b8c3fbc9012.pdf
```

## Field Mapping

| Form Field | agent_applications | applications |
|------------|-------------------|--------------|
| firstName | student_first_name | first_name |
| lastName | student_last_name | last_name |
| email | student_email | email |
| contactNumber | student_phone | phone |
| programme | programme | programme |
| dateOfBirth | application_data | date_of_birth |
| gender | application_data | gender |
| nationality | application_data | nationality |
| passportNumber | application_data | passport_number |
| academicHistory | application_data | institution_name, qualification, etc. |
| englishQualification | application_data | english_proficiency_type |
| employmentHistory | application_data | employer_name, job_title, etc. |
| references | application_data | ref_name, ref_email, etc. |
| funding | application_data | funding |
| disability | application_data | disability |
| additionalInfo | agent_notes | additional_info |

## Missing Information / To Be Determined

### ⚠️ Required Decisions

1. **Agent Email in applications table**
   - Currently using `$data['contactNumber']` for `agent_phone`
   - Should get agent email from agents table
   - **Action**: Need to fetch agent's email and company from agents table (IMPLEMENTED)

2. **Tuition Fee**
   - Not captured in current form
   - Needed for commission calculation
   - **Action**: Add tuition fee field to form OR set default value

3. **Date Format Conversion**
   - Form uses DD/MM/YYYY
   - Database expects YYYY-MM-DD
   - **Status**: Implemented for dateOfBirth, needs testing

4. **Signature Date**
   - Not captured in current form
   - Required for applications table
   - **Action**: Add signature date or use submission date

5. **Test Name vs English Qualification**
   - Form has `englishQualification`
   - Database wants `test_name` and `english_proficiency_type`
   - **Status**: Using same value for both fields

### 📋 Optional Enhancements

1. **File Type Icons**
   - Show PDF/DOC/IMG icons in file list
   
2. **Progress Indicator**
   - Show upload progress bar for large files
   
3. **File Preview**
   - Allow viewing uploaded files before submission
   
4. **Drag & Drop**
   - Enable drag-and-drop file upload
   
5. **Email Notifications**
   - Send confirmation email to student
   - Send notification to admissions team

## Testing Checklist

- [ ] Install npm dependencies (formidable, form-data)
- [ ] Create uploads directory with correct permissions
- [ ] Verify both database tables exist
- [ ] Test application submission without files
- [ ] Test application submission with files
- [ ] Verify files are saved to correct folder
- [ ] Check agent_applications table for new record
- [ ] Check applications table for synced record
- [ ] Verify agent statistics are updated
- [ ] Verify notification is created
- [ ] Test with multiple file uploads
- [ ] Test file size validation (>10MB)
- [ ] Test file type validation (non-PDF/DOC)
- [ ] Verify transaction rollback on error

## Troubleshooting

### Files Not Uploading
- Check directory permissions: `chmod 755 uploads/applications`
- Check PHP `upload_max_filesize` and `post_max_size` settings
- Verify `formidable` is installed: `npm list formidable`

### Database Insert Fails
- Check all required fields are provided
- Verify date formats (YYYY-MM-DD for dates)
- Check field lengths (names, emails, etc.)
- Look for SQL errors in PHP error logs

### Transaction Rollback
- If either insert fails, both will rollback
- Check error message to see which insert failed
- Verify foreign key constraints are satisfied

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install formidable form-data @types/formidable @types/form-data
   ```

2. **Create Upload Directory**
   ```bash
   mkdir -p public_html/uploads/applications
   ```

3. **Add Missing Fields** (Optional)
   - Tuition fee field
   - Signature date field
   - Student finance CRN (if applicable)

4. **Test Complete Flow**
   - Register test agent
   - Login to portal
   - Submit test application with files
   - Verify database entries
   - Check file storage

5. **Deploy to Production**
   - Set up upload directory on server
   - Configure PHP file upload limits
   - Test on live server
   - Monitor error logs

## Support

For issues or questions:
- Check PHP error logs: `/var/log/apache2/error.log` or equivalent
- Check Next.js console for frontend errors
- Verify database connections
- Test with small files first (< 1MB)

---

**Status**: Implementation Complete - Ready for Testing

**Last Updated**: January 30, 2026
