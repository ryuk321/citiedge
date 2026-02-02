-- ===================================================
-- AGENTS TABLE SETUP
-- For managing educational agents/recruitment partners
-- ===================================================

-- Drop existing table if needed (CAUTION: This will delete all agent data!)
-- DROP TABLE IF EXISTS agents;

-- Create agents table
CREATE TABLE agents (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Agent Identification
    agent_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique agent ID (e.g., AGT-2024-001)',
    agent_code VARCHAR(20) UNIQUE COMMENT 'Short code for agent (e.g., ABC123)',
    
    -- Company/Organization Information
    company_name VARCHAR(255) NOT NULL COMMENT 'Name of agency/company',
    company_registration_number VARCHAR(100) COMMENT 'Business registration number',
    company_type ENUM('individual', 'agency', 'institution', 'partner') DEFAULT 'agency',
    
    -- Contact Person Details
    contact_person_title ENUM('Mr', 'Mrs', 'Ms', 'Dr', 'Prof') DEFAULT 'Mr',
    contact_person_first_name VARCHAR(100) NOT NULL,
    contact_person_last_name VARCHAR(100) NOT NULL,
    contact_person_position VARCHAR(100) COMMENT 'Job title/position',
    
    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Primary contact email (used for login)',
    phone VARCHAR(50) COMMENT 'Primary phone number',
    mobile VARCHAR(50) COMMENT 'Mobile phone number',
    whatsapp VARCHAR(50) COMMENT 'WhatsApp number',
    
    -- Address Information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    
    -- Business Details
    website VARCHAR(255),
    operating_countries TEXT COMMENT 'JSON array of countries where agent operates',
    specialization TEXT COMMENT 'Areas of specialization (e.g., undergraduate, postgraduate)',
    years_in_business INT COMMENT 'Number of years in business',
    
    -- Commission & Financial
    commission_rate DECIMAL(5,2) DEFAULT 10.00 COMMENT 'Commission percentage',
    payment_method ENUM('bank_transfer', 'paypal', 'stripe', 'check', 'other') DEFAULT 'bank_transfer',
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(100),
    bank_account_name VARCHAR(100),
    bank_swift_code VARCHAR(50),
    tax_id_number VARCHAR(100) COMMENT 'Tax identification number',
    
    -- Agreement & Legal
    contract_start_date DATE COMMENT 'Partnership agreement start date',
    contract_end_date DATE COMMENT 'Partnership agreement end date',
    contract_status ENUM('active', 'expired', 'terminated', 'pending') DEFAULT 'pending',
    agreement_document_url VARCHAR(500) COMMENT 'URL to signed agreement document',
    
    -- Performance Metrics
    total_applications INT DEFAULT 0 COMMENT 'Total applications submitted',
    successful_enrollments INT DEFAULT 0 COMMENT 'Total students successfully enrolled',
    pending_applications INT DEFAULT 0 COMMENT 'Currently pending applications',
    rejected_applications INT DEFAULT 0 COMMENT 'Rejected applications',
    conversion_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Success rate percentage',
    
    -- Login & Security
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password for portal login',
    last_login DATETIME COMMENT 'Last login timestamp',
    login_attempts INT DEFAULT 0 COMMENT 'Failed login attempts counter',
    account_locked BOOLEAN DEFAULT FALSE COMMENT 'Account lock status',
    
    -- Status & Settings
    status ENUM('active', 'inactive', 'suspended', 'pending_approval') DEFAULT 'pending_approval',
    verification_status ENUM('verified', 'unverified', 'under_review') DEFAULT 'unverified',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Permissions & Access
    portal_access BOOLEAN DEFAULT TRUE COMMENT 'Can access agent portal',
    can_submit_applications BOOLEAN DEFAULT TRUE,
    can_view_commission BOOLEAN DEFAULT TRUE,
    requires_admin_approval BOOLEAN DEFAULT TRUE COMMENT 'Applications need admin approval',
    
    -- Notifications & Preferences
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_whatsapp BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Supporting Documents (URLs or file paths)
    business_license_url VARCHAR(500),
    identity_document_url VARCHAR(500),
    proof_of_address_url VARCHAR(500),
    reference_letter_url VARCHAR(500),
    
    -- Notes & Remarks
    admin_notes TEXT COMMENT 'Internal notes from admin',
    agent_notes TEXT COMMENT 'Notes from agent',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) COMMENT 'Admin who created this agent',
    updated_by VARCHAR(100) COMMENT 'Admin who last updated',
    
    -- Indexes for better performance
    INDEX idx_agent_id (agent_id),
    INDEX idx_email (email),
    INDEX idx_company_name (company_name),
    INDEX idx_status (status),
    INDEX idx_country (country),
    INDEX idx_contract_status (contract_status),
    INDEX idx_created_at (created_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Educational agents and recruitment partners';

-- ===================================================
-- AGENT APPLICATIONS TRACKING TABLE
-- Links applications to agents
-- ===================================================

-- Drop existing table if needed
-- DROP TABLE IF EXISTS agent_applications;

CREATE TABLE agent_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Link to agent
    agent_id VARCHAR(50) NOT NULL COMMENT 'References agents.agent_id',
    agent_name VARCHAR(255) NOT NULL COMMENT 'Denormalized for quick access',
    
    -- Application Details
    application_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique application identifier',
    student_first_name VARCHAR(100) NOT NULL,
    student_last_name VARCHAR(100) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50),
    
    -- Course Information
    programme VARCHAR(255) NOT NULL,
    course_level VARCHAR(100),
    intake VARCHAR(100),
    start_date DATE,
    
    -- Application Status
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'enrolled', 'withdrawn') DEFAULT 'draft',
    submission_date DATETIME,
    review_date DATETIME,
    decision_date DATETIME,
    
    -- Commission
    tuition_fee DECIMAL(10,2) DEFAULT 0.00,
    commission_amount DECIMAL(10,2) DEFAULT 0.00,
    commission_status ENUM('pending', 'approved', 'paid', 'cancelled') DEFAULT 'pending',
    commission_paid_date DATE,
    
    -- Application Data
    application_data JSON COMMENT 'Complete application form data',
    documents_uploaded INT DEFAULT 0 COMMENT 'Number of documents uploaded',
    
    -- Notes
    admin_notes TEXT,
    agent_notes TEXT,
    rejection_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_agent_id (agent_id),
    INDEX idx_application_id (application_id),
    INDEX idx_status (status),
    INDEX idx_student_email (student_email),
    INDEX idx_submission_date (submission_date),
    INDEX idx_commission_status (commission_status)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Applications submitted by agents';

-- ===================================================
-- AGENT NOTIFICATIONS TABLE
-- ===================================================

CREATE TABLE agent_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Agent Reference
    agent_id VARCHAR(50) NOT NULL,
    
    -- Notification Details
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'application_update', 'commission', 'system') DEFAULT 'info',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    
    -- Link to related entity
    related_entity_type VARCHAR(50) COMMENT 'e.g., application, commission, document',
    related_entity_id VARCHAR(100) COMMENT 'ID of related entity',
    
    -- Action Button
    action_url VARCHAR(500) COMMENT 'URL for notification action',
    action_label VARCHAR(100) COMMENT 'Label for action button',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME COMMENT 'When notification should be hidden',
    
    -- Foreign Key
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_agent_id (agent_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Notifications for agents';

-- ===================================================
-- AGENT COMMISSION PAYMENTS TABLE
-- ===================================================

CREATE TABLE agent_commission_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Agent Reference
    agent_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    
    -- Payment Details
    payment_id VARCHAR(50) UNIQUE NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    
    -- Amounts
    total_applications INT DEFAULT 0,
    successful_enrollments INT DEFAULT 0,
    total_tuition_fees DECIMAL(12,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    tax_deduction DECIMAL(10,2) DEFAULT 0.00,
    net_payment DECIMAL(12,2) NOT NULL,
    
    -- Payment Status
    status ENUM('pending', 'processing', 'paid', 'cancelled', 'on_hold') DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_date DATE,
    transaction_reference VARCHAR(255),
    
    -- Bank Details
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    
    -- Notes
    notes TEXT,
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    processed_by VARCHAR(100) COMMENT 'Admin who processed payment',
    
    -- Foreign Key
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_agent_id (agent_id),
    INDEX idx_payment_id (payment_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_period (payment_period_start, payment_period_end)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Commission payments to agents';

-- ===================================================
-- INSERT DEFAULT DATA (OPTIONAL)
-- ===================================================

-- Example: Create a test agent account
-- Password: Agent@123 (hashed with bcrypt - replace with actual hash)
INSERT INTO agents (
    agent_id,
    agent_code,
    company_name,
    contact_person_first_name,
    contact_person_last_name,
    email,
    phone,
    country,
    commission_rate,
    password_hash,
    status,
    contract_status,
    portal_access
) VALUES (
    'AGT-2024-001',
    'TEST001',
    'Test Education Consultancy',
    'John',
    'Doe',
    'agent@test.com',
    '+44 7700 900000',
    'United Kingdom',
    10.00,
    '$2b$10$rH8F9GzqH0JqKW7FqKQJXe.JD1HqJXQ8K2ZxXQ8K2ZxXQ8K2ZxXQ8', -- Replace with real hash
    'active',
    'active',
    TRUE
);

-- ===================================================
-- VERIFICATION QUERIES
-- ===================================================

-- View all agents
-- SELECT agent_id, company_name, contact_person_first_name, contact_person_last_name, email, status, created_at FROM agents;

-- View agent statistics
-- SELECT 
--     agent_id,
--     company_name,
--     total_applications,
--     successful_enrollments,
--     conversion_rate,
--     status
-- FROM agents
-- WHERE status = 'active'
-- ORDER BY successful_enrollments DESC;

-- View recent applications by agent
-- SELECT 
--     aa.application_id,
--     aa.student_first_name,
--     aa.student_last_name,
--     aa.programme,
--     aa.status,
--     aa.submission_date,
--     a.company_name
-- FROM agent_applications aa
-- JOIN agents a ON aa.agent_id = a.agent_id
-- ORDER BY aa.submission_date DESC
-- LIMIT 10;

-- ===================================================
-- NOTES FOR PHPMYADMIN
-- ===================================================
-- 1. Copy and paste this entire file into phpMyAdmin SQL tab
-- 2. Select your database first
-- 3. Click "Go" to execute
-- 4. Verify tables are created in the Structure tab
-- 5. Update lib/DB_Table.ts with these column names
-- ===================================================
