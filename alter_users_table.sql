-- Add reference_id column to users table for linking to students_info or staff_info
-- This field will store either student_number or staff_id depending on the user role

ALTER TABLE users 
ADD COLUMN reference_id VARCHAR(50) NULL COMMENT 'Student number or staff ID for linking to respective tables',
ADD INDEX idx_reference_id (reference_id);

-- Update role enum to include all possible roles
ALTER TABLE users 
MODIFY COLUMN role ENUM('student', 'admin', 'staff', 'super_admin', 'lecturer', 'agent') NOT NULL DEFAULT 'staff';

-- Ensure status column exists with proper enum values
ALTER TABLE users 
MODIFY COLUMN status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active';

-- Add foreign key constraints (optional, depends on your schema structure)
-- Uncomment if you want strict referential integrity:

-- ALTER TABLE users 
-- ADD CONSTRAINT fk_users_student 
-- FOREIGN KEY (reference_id) REFERENCES students_info(student_number) 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE users 
-- ADD CONSTRAINT fk_users_staff 
-- FOREIGN KEY (reference_id) REFERENCES staff_info(staff_id) 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Note: Foreign keys above are commented because a single column can't have two FKs
-- You may need to handle referential integrity at application level instead
