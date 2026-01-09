# Student ID Auto-Generation - Database Setup Instructions

## Overview
This setup enables automatic generation of unique 8-digit student IDs (starting from 10000001) with no duplicates.

## Required SQL Changes

### 1. Modify `students_info` Table

Run these SQL commands to ensure the `student_number` column supports the 8-digit IDs:

```sql
-- Make sure student_number column exists and is properly configured
ALTER TABLE students_info 
MODIFY COLUMN student_number VARCHAR(20) NULL;

-- Add a unique index to prevent duplicate student IDs
ALTER TABLE students_info 
ADD UNIQUE INDEX idx_student_number (student_number);

-- Optional: Add a check constraint (MySQL 8.0.16+)
ALTER TABLE students_info 
ADD CONSTRAINT chk_student_number_format 
CHECK (student_number REGEXP '^[0-9]{8}$' OR student_number IS NULL);
```

### 2. Verify Table Structure

Check that the column is set up correctly:

```sql
DESCRIBE students_info;
```

You should see:
- `student_number` - VARCHAR(20) or similar
- NULL or NOT NULL based on your requirements
- UNIQUE constraint visible

### 3. Check Existing Data

Review existing student numbers to ensure compatibility:

```sql
-- See all student numbers
SELECT id, student_number, first_name, last_name 
FROM students_info 
ORDER BY CAST(student_number AS UNSIGNED) DESC;

-- Check for invalid formats
SELECT id, student_number, first_name, last_name 
FROM students_info 
WHERE student_number NOT REGEXP '^[0-9]{8}$' 
AND student_number IS NOT NULL;

-- Get the highest student number
SELECT MAX(CAST(student_number AS UNSIGNED)) as highest_id 
FROM students_info 
WHERE student_number REGEXP '^[0-9]{8}$';
```

### 4. Update Existing Records (If Needed)

If you have existing students with non-8-digit IDs, you may want to migrate them:

```sql
-- Backup first!
CREATE TABLE students_info_backup AS SELECT * FROM students_info;

-- Option A: Start fresh with new ID sequence
UPDATE students_info 
SET student_number = LPAD((10000000 + id), 8, '0')
WHERE student_number NOT REGEXP '^[0-9]{8}$' OR student_number IS NULL;

-- Option B: Keep existing numbers, only update NULLs
UPDATE students_info 
SET student_number = LPAD((10000000 + id), 8, '0')
WHERE student_number IS NULL;
```

## How It Works

### PHP API Endpoint (`generateStudentId`)
1. Queries the database for the highest 8-digit student number
2. Increments by 1
3. Pads with zeros to ensure 8 digits
4. Checks for uniqueness (double-check)
5. Returns the next available ID

### Frontend Integration
1. When "Add Student" button is clicked, the form opens
2. Automatically calls the API to generate a new student ID
3. Pre-fills the student_number field
4. User can regenerate if needed
5. Field validates for 8-digit format

## Testing

### Test the API Endpoint
```bash
# Test via browser or curl
curl -H "X-API-KEY: super-secret-key" \
  "https://portal.citiedge.uk/public_html/student_api.php?action=generateStudentId"
```

Expected response:
```json
{
  "success": true,
  "studentId": "10000001",
  "nextId": 10000001
}
```

### Test the Frontend
1. Navigate to Admin > Students page
2. Click "Add Student" button
3. Verify student number field is auto-populated with 8-digit ID
4. Click "Regenerate" to test regeneration
5. Submit form and verify the student is saved with correct ID

## Troubleshooting

### Problem: Duplicate student IDs
**Solution:** 
```sql
-- Find duplicates
SELECT student_number, COUNT(*) as count 
FROM students_info 
GROUP BY student_number 
HAVING count > 1;

-- Remove the unique index temporarily
ALTER TABLE students_info DROP INDEX idx_student_number;

-- Fix duplicates manually
UPDATE students_info 
SET student_number = '10000099' 
WHERE id = 123; -- ID of duplicate

-- Re-add unique index
ALTER TABLE students_info 
ADD UNIQUE INDEX idx_student_number (student_number);
```

### Problem: Starting number too low
**Solution:**
```sql
-- Set the starting point manually
INSERT INTO students_info (student_number, first_name, last_name, status) 
VALUES ('19999999', 'Placeholder', 'Record', 'inactive');

-- Next generated ID will be 20000000
```

### Problem: API returns error
**Check:**
1. Database connection in `student_api.php`
2. API key is correct
3. Table exists: `SHOW TABLES LIKE 'students_info';`
4. Column exists: `DESCRIBE students_info;`

## Features

✅ **Automatic ID Generation** - No manual entry needed
✅ **Uniqueness Guaranteed** - Database constraint + API check
✅ **8-Digit Format** - Professional student ID format
✅ **Sequential** - Easy to track and manage
✅ **Collision Prevention** - Double-checks before assigning
✅ **Manual Override** - Users can still enter custom IDs if needed
✅ **Regeneration Option** - Can generate new ID if needed

## Future Enhancements

Consider adding:
- ID format customization (prefix, year, etc.)
- Batch ID generation for bulk imports
- ID recycling for deleted students
- Custom starting numbers per academic year
- Analytics on ID usage patterns

## Migration Notes

If migrating from old system:
1. Backup `students_info` table
2. Run SQL updates above
3. Test on staging environment first
4. Monitor for 24 hours after production deployment
5. Keep backup for 30 days

---

**Last Updated:** January 2, 2026
**Version:** 1.0
**Database:** citiedge_portal
**Table:** students_info
