# File Upload Fix - Agent Portal Application Submission

## Problem Identified

The file upload functionality from the admission site (admission.citiedgecollege.co.uk) was not working correctly when integrated into the agent portal. Files were not reaching the PHP backend correctly.

**Root Cause**: 
- The admission site sends FormData **directly** from browser to PHP
- The agent portal was parsing FormData in Next.js, then **reconstructing** it incorrectly before sending to PHP
- The key name for file attachments was inconsistent

## Files Fixed

### 1. `/pages/api/agent/applications.ts`
**Changes Made**:
- ✅ Fixed file attachment key from `attachments[${index}]` to `attachments[]` (matches PHP expectation)
- ✅ Added comprehensive debug logging to track data flow
- ✅ Added PHP response body logging to see exact error messages
- ✅ Added fallback URL for PHP API endpoint
- ✅ Improved error handling with JSON parse safety

**Key Fix**:
```typescript
// BEFORE (WRONG):
formData.append(`attachments[${index}]`, fileStream, {...});

// AFTER (CORRECT):
formData.append('attachments[]', fileStream, {...});
```

### 2. `/lib/agentData.ts`
**Changes Made**:
- ✅ Enhanced error logging to capture full response details
- ✅ Added response body text logging before JSON parsing
- ✅ Better error messages showing actual server response

## How It Works Now

### Data Flow:
```
Browser (FormData)
    ↓
Next.js API (/api/agent/applications)
    ↓ [parses with formidable]
    ↓ [rebuilds FormData with correct keys]
    ↓ [adds form-data headers]
    ↓
PHP Backend (agent_api.php)
    ↓ [receives $_POST and $_FILES]
    ↓ [validates agentId and required fields]
    ↓ [calls saveApplicationFiles()]
    ↓ [saves to: uploads/applications/LASTNAME-FIRSTNAME-PASSPORT/]
    ↓ [inserts into agent_applications table]
    ↓ [inserts into applications table]
    ↓ [commits transaction]
    ↓
Success Response
```

### File Upload Structure:
```
Frontend:
- Files added to FormData with key: 'attachments[]'
- Multiple files supported

Next.js API:
- Parses with formidable
- Rebuilds FormData with key: 'attachments[]'
- Streams file data to PHP

PHP Backend:
- Receives as: $_FILES['attachments']
- Array structure:
  - $_FILES['attachments']['name'][0], [1], [2]...
  - $_FILES['attachments']['tmp_name'][0], [1], [2]...
  - $_FILES['attachments']['size'][0], [1], [2]...
- saveApplicationFiles() processes array
```

### File Storage Location:
```
public_html/
  └── uploads/
      └── applications/
          └── LASTNAME-FIRSTNAME-PASSPORT/
              ├── TRANSCRIPT_1234567890_abc123.pdf
              ├── PASSPORT_1234567891_def456.jpg
              └── CERTIFICATE_1234567892_ghi789.pdf
```

### Database Structure:
```
agent_applications:
- agent_id, agent_name, application_id
- student details (first_name, last_name, email, phone)
- programme, course_level, intake
- tuition_fee, commission_amount, commission_status
- application_data (JSON blob with ALL form data)
- documents_uploaded (count)
- status, submission_date

applications (main admissions table):
- Complete student data normalized
- Synced from agent submission
- Used by admissions team
```

## Testing Instructions

### 1. Check Debug Logs

**In Browser Console** (Chrome DevTools):
```
Look for:
✓ "createApplication called with: {...}"
✓ "Adding field: agentId = AGT-2026-XXXXX"
✓ "Adding file 0: filename.pdf"
✓ "Sending FormData to API..."
✓ "Response status: 201 OK"
```

**In Next.js Terminal**:
```
Look for:
✓ "PHP_API_URL configured as: https://citiedgecollege.co.uk/agent_api.php"
✓ "=== RAW PARSED FIELDS ==="
✓ "=== BUILDING FORMDATA FOR PHP ==="
✓ "Adding to FormData: agentId = AGT-2026-XXXXX"
✓ "Adding 2 files to FormData"
✓ "=== SENDING TO PHP API ==="
✓ "PHP Response status: 201 OK"
```

**In PHP Error Log** (C:\xampp\apache\logs\error.log or server logs):
```
Look for:
✓ "=== CREATE APPLICATION REQUEST ==="
✓ "Has Files: YES"
✓ "POST data: Array (...)"
✓ "FILES data: Array (...)"
✓ "Parsed data: Array (...)"
✓ [If successful] No error messages
✗ [If failed] "VALIDATION FAILED: Missing field 'agentId'"
```

### 2. Verify File Upload

**Check if files were saved**:
```
Navigate to: public_html/uploads/applications/
Look for folder: LASTNAME-FIRSTNAME-PASSPORT/
Verify files inside have unique names: FILENAME_timestamp_uniqueid.ext
```

### 3. Verify Database Entries

**agent_applications table**:
```sql
SELECT 
    application_id, 
    agent_id, 
    student_first_name, 
    student_last_name, 
    programme,
    documents_uploaded,
    status,
    submission_date
FROM agent_applications 
ORDER BY submission_date DESC 
LIMIT 5;
```

**applications table**:
```sql
SELECT 
    first_name, 
    last_name, 
    email, 
    programme,
    agent_name,
    submitted_at
FROM applications 
WHERE agent_name IS NOT NULL
ORDER BY submitted_at DESC 
LIMIT 5;
```

### 4. Test Complete Workflow

1. **Login as Agent**: Use agent credentials
2. **Navigate**: Go to "New Application" page
3. **Fill Form**: Complete all required fields
4. **Upload Files**: Select 2-3 PDF/image files
5. **Submit**: Click "Submit Application"
6. **Verify Success**: Should see success message
7. **Check Application List**: New application should appear
8. **Check Files**: Files should be in uploads folder
9. **Check Database**: Both tables should have new entry

## Expected Results

### Success Response:
```json
{
  "success": true,
  "application": {
    "id": "APP-2026-XXXXX",
    "agentId": "AGT-2026-XXXXX",
    "firstName": "John",
    "lastName": "Doe",
    "status": "submitted",
    "submission_date": "2026-01-31 12:34:56"
  },
  "files": [
    {
      "original_name": "transcript.pdf",
      "saved_name": "TRANSCRIPT_1738334096_abc123.pdf",
      "path": "uploads/applications/DOE-JOHN-AB123456/TRANSCRIPT_1738334096_abc123.pdf",
      "size": 245678,
      "type": "application/pdf"
    }
  ]
}
```

### Error Response (if validation fails):
```json
{
  "success": false,
  "error": "Missing required field: agentId",
  "debug": {
    "hasFiles": true,
    "receivedFields": ["firstName", "lastName", "email"],
    "postKeys": ["firstName", "lastName", "email"],
    "contentType": "multipart/form-data; boundary=----..."
  }
}
```

## Troubleshooting

### Issue: "Missing required field: agentId"
**Solution**: Check PHP error logs for POST data. If POST is empty, the FormData is not being sent correctly.

### Issue: Files not uploading
**Solution**: 
1. Verify `uploads/applications/` folder exists and is writable (chmod 755)
2. Check PHP max_upload_size in php.ini (should be >= 10M)
3. Check formidable maxFileSize setting (currently 10MB)

### Issue: Transaction rollback
**Solution**: Check PHP error logs for database errors. Both inserts must succeed or transaction rolls back.

### Issue: CORS errors
**Solution**: Verify PHP API has proper CORS headers:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

## Next Steps

1. ✅ Test with single file upload
2. ✅ Test with multiple files
3. ✅ Test with large files (5-10MB)
4. ✅ Test without files (JSON only)
5. ✅ Verify commission calculation
6. ✅ Verify email notifications (if implemented)
7. ✅ Test error handling (missing fields, invalid files)

## Code Reference

### Frontend File Selection:
[components/agent/ApplicationUploadForm.tsx](components/agent/ApplicationUploadForm.tsx#L722-L750)

### API Data Submission:
[lib/agentData.ts](lib/agentData.ts#L519-L565)

### Next.js API Proxy:
[pages/api/agent/applications.ts](pages/api/agent/applications.ts)

### PHP Backend:
[public_html/agent_api.php](public_html/agent_api.php#L893-L1400)

### File Handler:
[public_html/agent_api.php](public_html/agent_api.php#L172-L300)

---

**Last Updated**: January 31, 2026
**Status**: ✅ Fixed and Ready for Testing
