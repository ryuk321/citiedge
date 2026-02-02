# Agent Application File Upload Setup

## Architecture Overview

This system uses a **cross-domain API-based file upload** approach to store agent application files on a separate subdomain.

```
┌─────────────────────────────────────────────────────────────┐
│  AGENT PORTAL (citiedgecollege.co.uk)                       │
│                                                              │
│  1. Agent submits application with files                    │
│  2. ApplicationUploadForm.tsx collects data                 │
│  3. Next.js API (pages/api/agent/applications.ts)           │
│     forwards to PHP                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST with FormData
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  MAIN API (citiedgecollege.co.uk/public_html)               │
│                                                              │
│  4. agent_api.php receives application data + files         │
│  5. Inserts data into:                                      │
│     - agent_applications table (agent tracking)             │
│     - applications table (admin review)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ cURL POST with files
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  FILE STORAGE API (admissions.citiedgecollege.co.uk)        │
│                                                              │
│  6. api/upload-files.php receives files                     │
│  7. Uses includes/file-handler.php functions                │
│  8. Saves to: uploads/applications/LASTNAME-FIRSTNAME-      │
│     PASSPORT/                                               │
│  9. Returns file paths array                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ JSON response with file paths
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  10. agent_api.php updates applications.file_paths          │
│  11. Returns success response to frontend                   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

### Main Portal (citiedgecollege.co.uk)
```
citiedg-portals/
├── components/agent/
│   └── ApplicationUploadForm.tsx (frontend form)
├── pages/api/agent/
│   └── applications.ts (Next.js API middleware)
└── public_html/
    ├── agent_api.php (main PHP API with file forwarding)
    └── agent_application_debug.txt (debug log)
```

### Admissions Subdomain (admissions.citiedgecollege.co.uk)
```
CITIEDGE-Applications/
└── public_html/
    ├── api/
    │   └── upload-files.php (file upload API endpoint) ✨ NEW
    ├── includes/
    │   └── file-handler.php (file storage functions)
    └── uploads/
        └── applications/
            └── SMITH-JOHN-AB123456/ (student folders)
                ├── PASSPORT_1234567890_abc123.pdf
                ├── TRANSCRIPT_1234567890_def456.pdf
                └── CERTIFICATE_1234567890_ghi789.pdf
```

## Key Components

### 1. Upload API Endpoint (`admissions.citiedgecollege.co.uk/api/upload-files.php`)

**Purpose**: Receive files from main portal and save to storage

**Accepts**:
- **POST Parameters**:
  - `firstName` (required)
  - `lastName` (required)
  - `passportNumber` (required)
  - `files[]` (array of uploaded files)

**Returns**:
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "files": [
    {
      "original_name": "transcript.pdf",
      "saved_name": "TRANSCRIPT_1703001234_abc123.pdf",
      "path": "uploads/applications/SMITH-JOHN-AB123/TRANSCRIPT_1703001234_abc123.pdf",
      "size": 245678,
      "type": "application/pdf"
    }
  ],
  "folder": "SMITH-JOHN-AB123456",
  "count": 3
}
```

### 2. File Handler (`includes/file-handler.php`)

**Functions**:
- `saveApplicationFiles()` - Main upload function
- `createDirectoryIfNotExists()` - Directory creation
- `validateFileSize()` - Max 10MB per file
- `validateFileType()` - PDF, JPG, PNG, DOC, DOCX only
- `generateUniqueFilename()` - Prevents overwrites
- `sanitizeFileName()` - Secure folder/file names

**Folder Naming**: `LASTNAME-FIRSTNAME-PASSPORT`
- Example: `SMITH-JOHN-AB123456`

**File Naming**: `FILENAME_timestamp_uniqueid.ext`
- Example: `TRANSCRIPT_1703001234_abc123def.pdf`

### 3. Agent API (`agent_api.php` - createAgentApplication case)

**File Forwarding Logic** (lines 1590-1700):

1. **Check for files**: Detects `$_FILES['files']` array
2. **Prepare cURL**: Creates `CURLFile` objects for each file
3. **POST to API**: 
   ```php
   $fileApiUrl = 'https://admissions.citiedgecollege.co.uk/api/upload-files.php';
   ```
4. **Handle response**: Parse JSON response
5. **Update database**: Store file paths in `applications.file_paths`
6. **Debug logging**: Log all operations to `agent_application_debug.txt`

## Setup Instructions

### Step 1: Deploy File Upload API

1. **Upload `upload-files.php` to admissions subdomain**:
   ```
   admissions.citiedgecollege.co.uk/public_html/api/upload-files.php
   ```

2. **Verify file-handler.php exists**:
   ```
   admissions.citiedgecollege.co.uk/public_html/includes/file-handler.php
   ```

3. **Create uploads directory**:
   ```bash
   mkdir -p /public_html/uploads/applications
   chmod 755 /public_html/uploads/applications
   ```

4. **Test API endpoint**:
   ```bash
   curl https://admissions.citiedgecollege.co.uk/api/upload-files.php
   # Should return: {"success":false,"error":"Method not allowed. Use POST."}
   ```

### Step 2: Update Main Portal

1. **agent_api.php already updated** ✅
   - File forwarding logic added (lines 1590-1700)
   - cURL integration complete
   - Debug logging enabled

2. **Verify Next.js API** (`pages/api/agent/applications.ts`):
   - Should already handle FormData with files
   - Array parsing bug already fixed

### Step 3: Frontend Configuration

**No changes needed** if your frontend already sends:
```javascript
const formData = new FormData();
formData.append('firstName', data.firstName);
formData.append('lastName', data.lastName);
formData.append('passportNumber', data.passportNumber);

// Append files
data.documents.forEach((file) => {
  formData.append('files[]', file);
});
```

### Step 4: Database Verification

**applications table** should have `file_paths` column (TEXT):
```sql
ALTER TABLE applications 
ADD COLUMN file_paths TEXT DEFAULT '[]';
```

## Testing Checklist

### ✅ Pre-Testing
- [ ] Upload API deployed to admissions subdomain
- [ ] file-handler.php exists and is readable
- [ ] uploads/applications/ directory exists with 755 permissions
- [ ] agent_api.php updated with file forwarding logic
- [ ] applications table has file_paths column

### 📤 Test File Upload

1. **Submit application with 2+ files**:
   - Personal info filled correctly
   - 2 academic history records
   - 2-3 document files attached (PDF/JPG)

2. **Check debug log** (`agent_application_debug.txt`):
   ```
   ==== FORWARDING FILES TO ADMISSIONS API ====
   Files count: 3
   Student: John Smith
   Passport: AB123456
   
   API Response Code: 200
   Response: {"success":true,"files":[...]}
   ```

3. **Verify file storage**:
   - Login to admissions subdomain via SFTP
   - Navigate to: `uploads/applications/`
   - Folder exists: `SMITH-JOHN-AB123456/`
   - Contains 3 files with unique names

4. **Check database**:
   ```sql
   SELECT first_name, last_name, file_paths 
   FROM applications 
   WHERE passport_number = 'AB123456';
   ```
   
   Expected `file_paths`:
   ```json
   [
     {
       "original_name": "passport.pdf",
       "saved_name": "PASSPORT_1703001234_abc123.pdf",
       "path": "uploads/applications/SMITH-JOHN-AB123456/PASSPORT_1703001234_abc123.pdf",
       "size": 123456,
       "type": "application/pdf"
     }
   ]
   ```

## File Access

### API Access (for displaying files)

**URL Format**:
```
https://admissions.citiedgecollege.co.uk/uploads/applications/SMITH-JOHN-AB123456/PASSPORT_1703001234_abc123.pdf
```

**In Admin Panel**:
```javascript
const fileUrl = `https://admissions.citiedgecollege.co.uk/${file.path}`;
// Display or download: window.open(fileUrl)
```

### SFTP Access (for manual management)

**Connect to**: `admissions.citiedgecollege.co.uk`
**Navigate to**: `/public_html/uploads/applications/`

## Security Features

1. **File Type Validation**: Only PDF, JPG, PNG, DOC, DOCX
2. **File Size Limit**: 10MB per file
3. **Secure Naming**: Special characters removed, uppercase
4. **Unique Filenames**: Timestamp + unique ID prevents overwrites
5. **Directory Isolation**: Each student has separate folder
6. **CORS Protection**: API accepts requests from main domain only
7. **Direct Access Prevention**: `DB_ACCESS` constant check in file-handler.php

## Troubleshooting

### Issue: "Failed to create upload directory"
**Solution**: 
```bash
chmod 755 /public_html/uploads
chmod 755 /public_html/uploads/applications
```

### Issue: "File API returned HTTP 500"
**Check**:
1. PHP error logs on admissions subdomain
2. file-handler.php exists and is readable
3. DB_ACCESS constant defined in upload-files.php

### Issue: Files not appearing in folder
**Check**:
1. Debug log: `agent_application_debug.txt`
2. Verify `$_FILES` contains data
3. Check cURL response code (should be 200)
4. Verify passportNumber is being sent correctly

### Issue: "Missing required field: passportNumber"
**Solution**: Ensure frontend sends `passportNumber` field:
```javascript
formData.append('passportNumber', data.passportNumber);
```

## File Paths in Database

The `file_paths` column stores a JSON array:

```json
[
  {
    "original_name": "passport.pdf",
    "saved_name": "PASSPORT_1703001234_abc123.pdf",
    "path": "uploads/applications/SMITH-JOHN-AB123456/PASSPORT_1703001234_abc123.pdf",
    "full_path": "/var/www/html/uploads/applications/SMITH-JOHN-AB123456/PASSPORT_1703001234_abc123.pdf",
    "size": 245678,
    "type": "application/pdf"
  }
]
```

**Usage in Admin Panel**:
```php
$files = json_decode($application['file_paths'], true);
foreach ($files as $file) {
    $downloadUrl = "https://admissions.citiedgecollege.co.uk/{$file['path']}";
    echo "<a href='{$downloadUrl}' target='_blank'>{$file['original_name']}</a>";
}
```

## Next Steps

1. ✅ Deploy `upload-files.php` to admissions subdomain
2. ✅ Test with 2+ academic records + files
3. ✅ Verify files appear in correct folder
4. ✅ Check database has file paths stored
5. 📋 Implement file display in admin panel
6. 📋 Add file download functionality
7. 📋 Create file deletion API (if needed)

## API Endpoint Summary

| Endpoint | Domain | Method | Purpose |
|----------|--------|--------|---------|
| `/api/agent/applications.ts` | citiedgecollege.co.uk | POST | Next.js middleware |
| `/public_html/agent_api.php` | citiedgecollege.co.uk | POST | Main application API |
| `/api/upload-files.php` | admissions.citiedgecollege.co.uk | POST | File upload API |

## Questions?

If you encounter issues:
1. Check `agent_application_debug.txt` for detailed logs
2. Verify all directories have correct permissions
3. Test API endpoint directly with cURL
4. Check PHP error logs on both domains
