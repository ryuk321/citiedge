-- ============================================
-- APPLICATIONS TABLE SCHEMA
-- Complete table structure for student applications management
-- ============================================

CREATE TABLE IF NOT EXISTS applications (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- SECTION 1: Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) DEFAULT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    country_of_residence VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50) DEFAULT NULL,
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    phone_country VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- SECTION 2: Course Selection
    programme VARCHAR(255) NOT NULL,
    intake_date VARCHAR(50) NOT NULL,
    study_mode VARCHAR(50) NOT NULL,
    campus VARCHAR(100) NOT NULL,
    level_of_study VARCHAR(100) NOT NULL,
    
    -- SECTION 3: Academic History (up to 3 entries)
    institution_name VARCHAR(255) DEFAULT NULL,
    country_of_study VARCHAR(100) DEFAULT NULL,
    qualification VARCHAR(255) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    start_date VARCHAR(20) DEFAULT NULL,
    end_date VARCHAR(20) DEFAULT NULL,
    grade VARCHAR(50) DEFAULT NULL,
    
    institution_name_2 VARCHAR(255) DEFAULT NULL,
    country_of_study_2 VARCHAR(100) DEFAULT NULL,
    qualification_2 VARCHAR(255) DEFAULT NULL,
    subject_2 VARCHAR(255) DEFAULT NULL,
    start_date_2 VARCHAR(20) DEFAULT NULL,
    end_date_2 VARCHAR(20) DEFAULT NULL,
    grade_2 VARCHAR(50) DEFAULT NULL,
    
    institution_name_3 VARCHAR(255) DEFAULT NULL,
    country_of_study_3 VARCHAR(100) DEFAULT NULL,
    qualification_3 VARCHAR(255) DEFAULT NULL,
    subject_3 VARCHAR(255) DEFAULT NULL,
    start_date_3 VARCHAR(20) DEFAULT NULL,
    end_date_3 VARCHAR(20) DEFAULT NULL,
    grade_3 VARCHAR(50) DEFAULT NULL,
    
    -- SECTION 4: English Language Proficiency
    english_proficiency_type VARCHAR(50) NOT NULL,
    test_name VARCHAR(100) DEFAULT NULL,
    test_score VARCHAR(50) DEFAULT NULL,
    test_date VARCHAR(20) DEFAULT NULL,
    
    -- SECTION 5: Employment History (up to 2 entries)
    employer_name VARCHAR(255) DEFAULT NULL,
    job_title VARCHAR(255) DEFAULT NULL,
    employment_start VARCHAR(20) DEFAULT NULL,
    employment_end VARCHAR(20) DEFAULT NULL,
    
    employer_name_2 VARCHAR(255) DEFAULT NULL,
    job_title_2 VARCHAR(255) DEFAULT NULL,
    employment_start_2 VARCHAR(20) DEFAULT NULL,
    employment_end_2 VARCHAR(20) DEFAULT NULL,
    
    -- SECTION 6: References (2 entries)
    ref_name VARCHAR(100) DEFAULT NULL,
    ref_relationship VARCHAR(100) DEFAULT NULL,
    ref_email VARCHAR(255) DEFAULT NULL,
    ref_contact VARCHAR(50) DEFAULT NULL,
    
    ref_name_2 VARCHAR(100) DEFAULT NULL,
    ref_relationship_2 VARCHAR(100) DEFAULT NULL,
    ref_email_2 VARCHAR(255) DEFAULT NULL,
    ref_contact_2 VARCHAR(50) DEFAULT NULL,
    
    -- SECTION 7: Funding & Scholarships
    funding VARCHAR(100) NOT NULL,
    apply_scholarship VARCHAR(3) DEFAULT NULL,
    scholarship_name VARCHAR(255) DEFAULT NULL,
    
    -- SECTION 7B: Agent Information
    is_agent_application VARCHAR(3) NOT NULL DEFAULT 'No',
    agent_name VARCHAR(100) DEFAULT NULL,
    agent_company VARCHAR(255) DEFAULT NULL,
    agent_email VARCHAR(255) DEFAULT NULL,
    agent_phone VARCHAR(50) DEFAULT NULL,
    
    -- SECTION 8: Additional Information
    disability VARCHAR(3) NOT NULL,
    disability_details TEXT DEFAULT NULL,
    criminal_conviction VARCHAR(3) NOT NULL,
    conviction_details TEXT DEFAULT NULL,
    additional_info TEXT DEFAULT NULL,
    
    -- SECTION 9: Declaration
    declaration VARCHAR(3) NOT NULL,
    signature_name VARCHAR(100) NOT NULL,
    signature_date DATE NOT NULL,
    
    -- File Attachments (JSON array of filenames)
    file_paths JSON DEFAULT NULL,
    
    -- Application Status & Metadata
    status ENUM('pending', 'under_review', 'accepted', 'rejected', 'withdrawn', 'deferred') NOT NULL DEFAULT 'pending',
    submission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT DEFAULT NULL,
    assigned_to VARCHAR(100) DEFAULT NULL,
    
    -- Indexes for better query performance
    INDEX idx_email (email),
    INDEX idx_last_name (last_name),
    INDEX idx_status (status),
    INDEX idx_submission_date (submission_date),
    INDEX idx_programme (programme),
    INDEX idx_agent (is_agent_application, agent_email)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Direct Application Example
INSERT INTO applications (
    firstName, lastName, email, programme, status, 
    isAgentApplication, submissionDate
) VALUES (
    'John', 'Doe', 'john.doe@example.com', 'BSc Computer Science', 'pending',
    'No', NOW()
);

-- Agent Application Example
INSERT INTO applications (
    firstName, lastName, email, programme, status,
    isAgentApplication, agentName, agentCompany, agentEmail,
    submissionDate
) VALUES (
    'Jane', 'Smith', 'jane.smith@example.com', 'MSc Business Administration', 'under_review',
    'Yes', 'Sarah Johnson', 'Global Education Partners', 'sarah@globaledu.com',
    NOW()
);

-- ============================================
-- Useful Queries for Testing
-- ============================================

-- Count applications by status
SELECT status, COUNT(*) as count
FROM applications
GROUP BY status;

-- Count applications by source (Direct vs Agent)
SELECT 
    isAgentApplication as source,
    COUNT(*) as count
FROM applications
GROUP BY isAgentApplication;

-- Get agent statistics
SELECT 
    agentCompany,
    agentName,
    agentEmail,
    COUNT(*) as applications_count
FROM applications
WHERE isAgentApplication = 'Yes' AND agentCompany IS NOT NULL
GROUP BY agentCompany, agentName, agentEmail
ORDER BY applications_count DESC;

-- Get recent applications
SELECT 
    id, firstName, lastName, email, programme, status,
    isAgentApplication, agentCompany, submissionDate
FROM applications
ORDER BY submissionDate DESC
LIMIT 10;
