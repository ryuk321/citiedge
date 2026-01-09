-- ========================================
-- OFQUAL LEARNER ENROLLMENT DATABASE TABLE
-- ========================================
-- This table stores all learner applications and enrollments for OTHM/QUALIFI courses
-- Complies with GDPR and Ofqual requirements

CREATE TABLE IF NOT EXISTS ofqual_enrollments (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Application Reference
    application_ref VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique application reference number',
    
    -- SECTION 1: Personal Details
    full_legal_name VARCHAR(255) NOT NULL COMMENT 'Full legal name as per ID',
    date_of_birth DATE NOT NULL COMMENT 'Date of birth',
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say', '') DEFAULT '' COMMENT 'Gender (optional)',
    nationality VARCHAR(100) COMMENT 'Nationality',
    uln VARCHAR(10) COMMENT 'Unique Learner Number (10 digits)',
    address TEXT COMMENT 'Contact address',
    postcode VARCHAR(20) COMMENT 'Postcode',
    email VARCHAR(255) NOT NULL COMMENT 'Email address',
    telephone VARCHAR(50) NOT NULL COMMENT 'Telephone number',
    
    -- SECTION 2: Identification & Eligibility
    id_type ENUM('Passport', 'Driving Licence', 'National ID Card', 'Other') NOT NULL COMMENT 'Type of photo ID',
    right_to_study_uk ENUM('Yes', 'No', 'Not applicable (overseas learner)', '') DEFAULT '' COMMENT 'Right to study in UK',
    
    -- SECTION 3: Qualification Details
    qualification_title VARCHAR(255) NOT NULL COMMENT 'Course/qualification title',
    qualification_level ENUM('Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8') NOT NULL COMMENT 'RQF level',
    awarding_organisation ENUM('OTHM', 'QUALIFI') NOT NULL COMMENT 'Awarding body',
    mode_of_study ENUM('Classroom', 'Online', 'Blended', 'Distance Learning') NOT NULL COMMENT 'Mode of delivery',
    proposed_start_date DATE COMMENT 'Intended start date',
    
    -- SECTION 4: Entry Requirements & Prior Learning
    highest_qualification VARCHAR(255) NOT NULL COMMENT 'Highest academic qualification',
    relevant_work_experience TEXT COMMENT 'Relevant work experience',
    english_proficiency ENUM('Native speaker', 'IELTS', 'Other evidence', '') DEFAULT '' COMMENT 'English language proficiency',
    ielts_score VARCHAR(10) COMMENT 'IELTS score if applicable',
    
    -- SECTION 5: Equality & Diversity Monitoring (Optional)
    has_disability ENUM('Yes', 'No', 'Prefer not to say') DEFAULT 'No' COMMENT 'Has disability/learning difficulty',
    disability_details TEXT COMMENT 'Details of disability if any',
    ethnic_origin ENUM('White', 'Asian', 'Black', 'Mixed', 'Other', 'Prefer not to say', '') DEFAULT '' COMMENT 'Ethnic origin (optional)',
    
    -- SECTION 6: Reasonable Adjustments & Special Consideration
    requires_adjustments ENUM('Yes', 'No') DEFAULT 'No' COMMENT 'Requires reasonable adjustments',
    adjustment_details TEXT COMMENT 'Details of required adjustments',
    consent_to_share BOOLEAN DEFAULT false COMMENT 'Consent to share info with awarding org',
    
    -- SECTION 7: Data Protection & GDPR Consent
    read_privacy_notice BOOLEAN NOT NULL DEFAULT false COMMENT 'Confirmed reading privacy notice',
    consent_data_processing BOOLEAN NOT NULL DEFAULT false COMMENT 'Consent to data processing',
    
    -- SECTION 8: Learner Declaration
    agree_to_policies BOOLEAN NOT NULL DEFAULT false COMMENT 'Agreed to all policies',
    
    -- Application Status & Processing
    application_status ENUM('pending', 'under_review', 'approved', 'rejected', 'enrolled', 'withdrawn') DEFAULT 'pending' COMMENT 'Current application status',
    student_id VARCHAR(50) COMMENT 'Assigned student ID after enrollment',
    enrollment_date DATE COMMENT 'Date of enrollment',
    
    -- Reviewer Notes
    reviewer_id INT COMMENT 'ID of staff who reviewed',
    reviewer_notes TEXT COMMENT 'Internal notes from reviewer',
    reviewed_at TIMESTAMP NULL COMMENT 'Date/time of review',
    
    -- Audit Trail
    ip_address VARCHAR(45) COMMENT 'IP address at submission',
    user_agent TEXT COMMENT 'Browser user agent',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date of submission',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_application_ref (application_ref),
    INDEX idx_email (email),
    INDEX idx_application_status (application_status),
    INDEX idx_qualification_level (qualification_level),
    INDEX idx_awarding_organisation (awarding_organisation),
    INDEX idx_submission_date (submission_date),
    INDEX idx_student_id (student_id),
    
    -- Foreign Key (if linking to existing users table)
    -- FOREIGN KEY (student_id) REFERENCES students_info(student_number) ON DELETE SET NULL,
    
    FULLTEXT INDEX ft_search (full_legal_name, email, qualification_title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores Ofqual-regulated course enrollment applications (OTHM/QUALIFI)';

-- ========================================
-- GENERATE APPLICATION REFERENCE NUMBER
-- ========================================
-- Trigger to auto-generate application reference on insert
DELIMITER //

CREATE TRIGGER generate_application_ref
BEFORE INSERT ON ofqual_enrollments
FOR EACH ROW
BEGIN
    DECLARE next_num INT;
    DECLARE year_code VARCHAR(4);
    
    -- Get current year (e.g., '2026')
    SET year_code = YEAR(CURRENT_DATE);
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_ref, 9) AS UNSIGNED)), 0) + 1
    INTO next_num
    FROM ofqual_enrollments
    WHERE application_ref LIKE CONCAT('OFQ', year_code, '%');
    
    -- Generate reference: OFQ2026-0001, OFQ2026-0002, etc.
    SET NEW.application_ref = CONCAT('OFQ', year_code, '-', LPAD(next_num, 4, '0'));
END//

DELIMITER ;

-- ========================================
-- SAMPLE DATA (FOR TESTING ONLY)
-- ========================================
-- Uncomment to insert sample data for testing

/*
INSERT INTO ofqual_enrollments (
    full_legal_name,
    date_of_birth,
    gender,
    nationality,
    email,
    telephone,
    id_type,
    qualification_title,
    qualification_level,
    awarding_organisation,
    mode_of_study,
    highest_qualification,
    read_privacy_notice,
    consent_data_processing,
    agree_to_policies,
    application_status
) VALUES (
    'John Smith',
    '1995-05-15',
    'Male',
    'British',
    'john.smith@example.com',
    '+44 7700 900123',
    'Passport',
    'Business and Management',
    'Level 7',
    'OTHM',
    'Online',
    'Bachelor Degree in Business Administration',
    true,
    true,
    true,
    'pending'
);
*/

-- ========================================
-- USEFUL QUERIES
-- ========================================

-- Count applications by status
-- SELECT application_status, COUNT(*) as count 
-- FROM ofqual_enrollments 
-- GROUP BY application_status;

-- Recent applications
-- SELECT application_ref, full_legal_name, email, qualification_title, application_status, submission_date
-- FROM ofqual_enrollments 
-- ORDER BY submission_date DESC 
-- LIMIT 10;

-- Applications by qualification level
-- SELECT qualification_level, COUNT(*) as count
-- FROM ofqual_enrollments
-- GROUP BY qualification_level
-- ORDER BY qualification_level;

-- Applications requiring adjustments
-- SELECT application_ref, full_legal_name, adjustment_details
-- FROM ofqual_enrollments
-- WHERE requires_adjustments = 'Yes';
