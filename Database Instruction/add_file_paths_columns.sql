-- Add file_paths and documents_uploaded columns to applications table
-- Run this SQL in your database if these columns don't exist yet

-- Check if columns exist first
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'applications' 
AND COLUMN_NAME IN ('file_paths', 'documents_uploaded');

-- Add the columns if they don't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS file_paths TEXT AFTER application_data,
ADD COLUMN IF NOT EXISTS documents_uploaded INT DEFAULT 0 AFTER file_paths;

-- Verify columns were added
DESCRIBE applications;
