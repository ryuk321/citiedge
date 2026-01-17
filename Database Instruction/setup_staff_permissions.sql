-- Staff Permissions System Setup
-- This SQL script creates the necessary tables for staff permission management

-- Table: staff_permissions
-- Stores page-level permissions for each staff member
CREATE TABLE IF NOT EXISTS staff_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL,
    pageId VARCHAR(100) NOT NULL,
    page_name VARCHAR(200) NOT NULL,
    canView BOOLEAN DEFAULT false,
    canEdit BOOLEAN DEFAULT false,
    canDelete BOOLEAN DEFAULT false,
    grantedBy VARCHAR(50) NOT NULL COMMENT 'Admin user_id who granted permission',
    grantedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_staff_page (staff_id, pageId),
    INDEX idx_staff_id (staff_id),
    INDEX idx_pageId (pageId),
    FOREIGN KEY (staff_id) REFERENCES staff_info(staff_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: staff_activity_log
-- Tracks all actions performed by staff members for audit purposes
CREATE TABLE IF NOT EXISTS staff_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(200) NOT NULL,
    action ENUM('create', 'update', 'delete', 'view') NOT NULL,
    target_type ENUM('student', 'application', 'enrollment', 'attendance', 'grade', 'other') NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    target_name VARCHAR(255),
    changes TEXT COMMENT 'JSON string of changes',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_staff_id (staff_id),
    INDEX idx_action (action),
    INDEX idx_target (target_type, target_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (staff_id) REFERENCES staff_info(staff_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default permissions for existing staff (optional)
-- You can customize these based on staff roles
-- Example: Grant basic dashboard access to all active staff
INSERT IGNORE INTO staff_permissions (staff_id, pageId, page_name, canView, canEdit, canDelete, grantedBy)
SELECT 
    staff_id,
    'dashboard',
    'Dashboard',
    true,
    false,
    false,
    'admin'
FROM staff_info
WHERE status = 'active';

-- Example: Grant lecturers access to view students
INSERT IGNORE INTO staff_permissions (staff_id, pageId, page_name, canView, canEdit, canDelete, grantedBy)
SELECT 
    staff_id,
    'admitted_students',
    'Admitted Students',
    true,
    false,
    false,
    'admin'
FROM staff_info
WHERE position LIKE '%Lecturer%' AND status = 'active';
