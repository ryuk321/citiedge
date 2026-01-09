-- ========================================
-- COMPLETE DATABASE SETUP FOR STUDENT PORTAL
-- ========================================
-- Run this script to create all necessary tables
-- for the student payment and tuition system

-- ========================================
-- 1. STUDENT PAYMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS student_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    payment_type VARCHAR(100) NOT NULL COMMENT 'e.g., Tuition Fee, Registration Fee, Exam Fee',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Payment amount',
    currency VARCHAR(3) DEFAULT 'GBP' COMMENT 'Currency code (GBP, USD, EUR)',
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE COMMENT 'Stripe PaymentIntent ID',
    stripe_charge_id VARCHAR(255) DEFAULT NULL COMMENT 'Stripe Charge ID',
    payment_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, succeeded, failed, refunded',
    description TEXT DEFAULT NULL COMMENT 'Additional payment details',
    receipt_url TEXT DEFAULT NULL COMMENT 'Stripe receipt URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_id (student_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_stripe_payment_intent (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores student payment transactions via Stripe';

-- ========================================
-- 2. STUDENT TUITION FEES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS student_tuition_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL COMMENT 'e.g., 2024-2025',
    semester VARCHAR(50) NOT NULL COMMENT 'e.g., Fall 2024, Spring 2025',
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_id (student_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_academic_year (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores student tuition fee records';

-- ========================================
-- 3. INSERT SAMPLE DATA FOR TESTING
-- ========================================

-- Sample tuition fees for STD-2024-001
INSERT INTO student_tuition_fees 
(student_id, academic_year, semester, total_amount, paid_amount, due_amount, due_date, status) 
VALUES 
('STD-2024-001', '2025-2026', 'Fall 2025', 15000.00, 15000.00, 0.00, '2025-09-01', 'paid'),
('STD-2024-001', '2025-2026', 'Spring 2026', 15000.00, 5000.00, 10000.00, '2026-01-15', 'pending'),
('STD-2024-001', '2026-2027', 'Fall 2026', 15500.00, 0.00, 15500.00, '2026-09-01', 'pending');

-- Sample payment records
INSERT INTO student_payments 
(student_id, student_name, student_email, payment_type, amount, currency, 
 stripe_payment_intent_id, payment_status, description) 
VALUES 
('STD-2024-001', 'John Doe', 'john.doe@citiedge.edu', 'Tuition Fee', 15000.00, 'GBP', 
 'pi_sample_fall2025', 'succeeded', 'Fall 2025 tuition payment'),
('STD-2024-001', 'John Doe', 'john.doe@citiedge.edu', 'Tuition Fee', 5000.00, 'GBP', 
 'pi_sample_spring2026_partial', 'succeeded', 'Spring 2026 partial payment');

-- ========================================
-- 4. VERIFY TABLE CREATION
-- ========================================
SELECT 'Tables created successfully!' AS status;

SELECT 'student_payments table:' AS info;
DESCRIBE student_payments;

SELECT 'student_tuition_fees table:' AS info;
DESCRIBE student_tuition_fees;

-- Show sample data
SELECT 'Sample tuition fees:' AS info;
SELECT * FROM student_tuition_fees WHERE student_id = 'STD-2024-001';

SELECT 'Sample payments:' AS info;
SELECT * FROM student_payments WHERE student_id = 'STD-2024-001';
