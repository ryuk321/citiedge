-- ================================================
-- Student ID Auto-Generation Setup
-- ================================================
-- Run this SQL script in your MySQL database
-- Database: citiedge_portal
-- Date: January 2, 2026
-- ================================================

USE citiedge_portal;

-- Step 1: Modify student_number column to support 8-digit IDs
ALTER TABLE students_info 
MODIFY COLUMN student_number VARCHAR(20) NULL;

-- Step 2: Add unique index to prevent duplicates
-- Note: This will fail if duplicates exist. Fix them first!
ALTER TABLE students_info 
ADD UNIQUE INDEX idx_student_number (student_number);

-- Step 3: Add check constraint for format validation (MySQL 8.0.16+)
-- Comment this out if you're using MySQL < 8.0.16
ALTER TABLE students_info 
ADD CONSTRAINT chk_student_number_format 
CHECK (student_number REGEXP '^[0-9]{8}$' OR student_number IS NULL);

-- ================================================
-- Verification Queries
-- ================================================

-- Check table structure
DESCRIBE students_info;

-- View existing student numbers
SELECT id, student_number, first_name, last_name 
FROM students_info 
ORDER BY CAST(student_number AS UNSIGNED) DESC 
LIMIT 20;

-- Find the highest existing ID
SELECT MAX(CAST(student_number AS UNSIGNED)) as highest_student_id,
       COUNT(*) as total_students
FROM students_info 
WHERE student_number REGEXP '^[0-9]{8}$';

-- Check for any invalid formats
SELECT id, student_number, first_name, last_name 
FROM students_info 
WHERE student_number NOT REGEXP '^[0-9]{8}$' 
AND student_number IS NOT NULL;

-- ================================================
-- Optional: Data Migration
-- ================================================

-- BACKUP TABLE FIRST!
-- CREATE TABLE students_info_backup_20260102 AS SELECT * FROM students_info;

-- Option 1: Assign new 8-digit IDs to existing students
-- This keeps a sequential order based on existing ID
-- UPDATE students_info 
-- SET student_number = LPAD((10000000 + id), 8, '0')
-- WHERE student_number IS NULL 
-- OR student_number NOT REGEXP '^[0-9]{8}$';

-- Option 2: Only update NULL values
-- UPDATE students_info 
-- SET student_number = LPAD((10000000 + id), 8, '0')
-- WHERE student_number IS NULL;

-- ================================================
-- Test the Setup
-- ================================================

-- This should show the next ID that will be generated
SELECT LPAD(COALESCE(MAX(CAST(student_number AS UNSIGNED)), 10000000) + 1, 8, '0') as next_student_id
FROM students_info 
WHERE student_number REGEXP '^[0-9]{8}$';

-- ================================================
-- Rollback (if needed)
-- ================================================

-- To undo all changes:
-- ALTER TABLE students_info DROP INDEX idx_student_number;
-- ALTER TABLE students_info DROP CONSTRAINT chk_student_number_format;
-- RESTORE FROM BACKUP IF NEEDED

-- ================================================
-- Done!
-- ================================================
-- Next steps:
-- 1. Verify all queries returned expected results
-- 2. Test the API endpoint: /api/student/generate-id
-- 3. Test adding a new student via the admin interface
-- 4. Monitor for any duplicate ID errors
-- ================================================
