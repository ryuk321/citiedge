-- ===================================================
-- Complete the Verification Setup
-- Run these in phpMyAdmin after adding the columns
-- ===================================================

USE citiedge_portal;

-- Add indexes for faster lookups
ALTER TABLE agents ADD INDEX idx_verification_token (email_verification_token);
ALTER TABLE agents ADD INDEX idx_password_reset_token (password_reset_token);

-- Update existing agents to set them as verified
-- (so they don't need to verify again)
UPDATE agents 
SET email_verified = TRUE, 
    verification_status = 'verified'
WHERE email_verification_token IS NULL 
  AND email_verified = FALSE;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
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

SELECT 'Setup Complete! ✅' as Status;
