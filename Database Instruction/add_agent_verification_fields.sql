-- ===================================================
-- ADD EMAIL VERIFICATION FIELDS TO AGENTS TABLE
-- This update adds email verification token support
-- ===================================================

USE citiedge_portal;

-- Add email verification columns if they don't exist
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) DEFAULT NULL COMMENT 'Token for email verification',
ADD COLUMN IF NOT EXISTS email_verification_expiry DATETIME DEFAULT NULL COMMENT 'Token expiration timestamp',
ADD COLUMN IF NOT EXISTS email_verified_at DATETIME DEFAULT NULL COMMENT 'Timestamp when email was verified';

-- Add index for faster lookups
ALTER TABLE agents
ADD INDEX idx_verification_token (email_verification_token);

-- Optional: Add password reset token fields for future use
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) DEFAULT NULL COMMENT 'Token for password reset',
ADD COLUMN IF NOT EXISTS password_reset_expiry DATETIME DEFAULT NULL COMMENT 'Password reset token expiration';

-- Add index for password reset lookups
ALTER TABLE agents
ADD INDEX idx_password_reset_token (password_reset_token);

-- Update existing agents to set email_verified to TRUE if they don't have tokens
UPDATE agents 
SET email_verified = TRUE, 
    verification_status = 'verified'
WHERE email_verification_token IS NULL 
  AND email_verified = FALSE;

-- Show updated table structure
DESCRIBE agents;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT, 
    COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'citiedge_portal' 
  AND TABLE_NAME = 'agents' 
  AND COLUMN_NAME IN (
    'email_verification_token', 
    'email_verification_expiry', 
    'email_verified_at',
    'password_reset_token',
    'password_reset_expiry'
  );

-- ===================================================
-- VERIFICATION COMPLETE
-- ===================================================
-- The agents table now supports:
-- 1. Email verification with expiring tokens
-- 2. Password reset functionality (ready for future use)
-- 3. Tracking of verification timestamps
-- ===================================================
