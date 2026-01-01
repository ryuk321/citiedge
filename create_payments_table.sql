-- ========================================
-- STUDENT PAYMENTS TABLE
-- ========================================
-- This table stores all payment transactions made by students
-- Run this SQL in your MySQL database to create the payments table

CREATE TABLE IF NOT EXISTS student_payments (
    -- Primary key
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Student information
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    
    -- Payment details
    payment_type VARCHAR(100) NOT NULL COMMENT 'e.g., Tuition, Fees, Library Fine',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Payment amount in dollars',
    currency VARCHAR(3) DEFAULT 'GBP' COMMENT 'Currency code (GBP, USD, EUR, etc.)',
    
    -- Stripe information
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE COMMENT 'Stripe PaymentIntent ID',
    stripe_charge_id VARCHAR(255) DEFAULT NULL COMMENT 'Stripe Charge ID',
    payment_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, succeeded, failed, refunded',
    
    -- Additional information
    description TEXT DEFAULT NULL COMMENT 'Additional payment details',
    receipt_url TEXT DEFAULT NULL COMMENT 'Stripe receipt URL',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for faster queries
    INDEX idx_student_id (student_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_stripe_payment_intent (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores student payment transactions via Stripe';

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================
-- Uncomment below to insert sample data
/*
INSERT INTO student_payments 
(student_id, student_name, student_email, payment_type, amount, stripe_payment_intent_id, payment_status) 
VALUES 
('ST001', 'John Doe', 'john.doe@example.com', 'Tuition Fee', 1500.00, 'pi_test_12345', 'succeeded'),
('ST002', 'Jane Smith', 'jane.smith@example.com', 'Library Fine', 25.50, 'pi_test_67890', 'succeeded');
*/

-- ========================================
-- VERIFY TABLE CREATION
-- ========================================
-- Run this to check if the table was created successfully
SELECT 'Table created successfully!' AS status;
DESCRIBE student_payments;
