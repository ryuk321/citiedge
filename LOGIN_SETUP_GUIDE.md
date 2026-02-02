# Login Setup Guide - CITIEDGE Portal

## 🔐 Authentication System Overview

The login system uses the existing **PHP API** (`student_api.php`) to authenticate users against the database with secure bcrypt password hashing.

## 📋 How It Works

### 1. **Login Flow**
```
User enters credentials → Frontend (login.tsx) → auth.ts → PHP API (student_api.php) → Database → Response
```

### 2. **Security Features**
- ✅ **Bcrypt password hashing** - Passwords are verified securely on the server
- ✅ **API Key authentication** - All API requests require valid API key
- ✅ **Email validation** - Client-side email format validation
- ✅ **Account status checking** - Only active accounts can log in
- ✅ **Role-based redirection** - Users are redirected to their portal based on role
- ✅ **Session management** - User data stored in localStorage (client-side)

### 3. **Password Storage**
Passwords in the database MUST be stored as bcrypt hashes:
```php
// Example: How passwords should be stored
$password_hash = password_hash($password, PASSWORD_BCRYPT);
```

---

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Create or update your `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://portals.citiedge.uk/public_html
NEXT_PUBLIC_API_KEY=super-secret-key

# Alternative for local development:
# NEXT_PUBLIC_API_BASE_URL=http://localhost/citiedge-portals/public_html
```

**Important Notes:**
- The `NEXT_PUBLIC_` prefix makes the variable accessible in the browser
- Match your `NEXT_PUBLIC_API_KEY` with the one in your PHP API files
- Don't include `/student_api.php` in the URL - it's added automatically

### Step 2: Verify Database Setup

Ensure your `users` table has the correct structure:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff', 'lecturer', 'admin', 'super_admin', 'agent') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    reference_id VARCHAR(50),
    student_number VARCHAR(50),
    staff_id VARCHAR(50),
    agent_id VARCHAR(50),
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 3: Create Test User

**IMPORTANT:** Passwords must be bcrypt hashed. Use this PHP code to generate a hash:

```php
<?php
// Run this to generate a bcrypt hash for "password123"
echo password_hash("password123", PASSWORD_BCRYPT);
?>
```

Then insert the user:

```sql
INSERT INTO users (email, username, password_hash, role, status, reference_id)
VALUES (
    'admin@citiedge.ac.uk',
    'admin',
    '$2y$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
    'admin',
    'active',
    'ADM-2026-001'
);
```

### Step 4: Verify PHP API Configuration

Check your `student_api.php` file has these settings:

```php
// At the top of student_api.php
$host = "localhost";
$db   = "citiedge_portal";
$user = "citiedge_portal";
$pass = "dw3WT2tss4r7A654Srwc";

$validKey = "super-secret-key"; // Must match NEXT_PUBLIC_API_KEY in .env.local
```

### Step 5: Test the Login

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/Login/login`

3. Test with your credentials:
   - Email: `admin@citiedge.ac.uk`
   - Password: `password123` (or whatever you used)

---

## 🎯 Role-Based Redirects

After successful login, users are redirected based on their role:

| Role | Redirect Path |
|------|---------------|
| `super_admin` | `/Admin/adminpage` |
| `admin` | `/Admin/adminpage` |
| `staff` | `/staff/new-portal` |
| `lecturer` | `/staff/portal` |
| `student` | `/student/portal-new` |
| `agent` | `/Admin/adminpage` |

---

## 🔧 Troubleshooting

### Problem: "Invalid API Key" error
**Solution:** Ensure `NEXT_PUBLIC_API_KEY` in `.env.local` matches `$validKey` in `student_api.php`

### Problem: "Invalid email or password"
**Solution:** 
1. Verify the user exists in the database: `SELECT * FROM users WHERE email = 'your@email.com'`
2. Ensure the password is bcrypt hashed (should start with `$2y$`)
3. Check the `status` field is set to `'active'`

### Problem: CORS errors in browser console
**Solution:** Verify your `student_api.php` has CORS headers:
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
```

### Problem: Network error
**Solution:** 
1. Check your API URL is correct in `.env.local`
2. Ensure the PHP API is accessible (test directly: `https://your-domain.com/public_html/student_api.php?action=test`)
3. Check server error logs

---

## 📝 Quick Test Checklist

- [ ] Environment variables configured in `.env.local`
- [ ] Database connection details correct in `student_api.php`
- [ ] API key matches between frontend and backend
- [ ] Test user created with bcrypt password hash
- [ ] User status is 'active'
- [ ] PHP API is accessible and responding
- [ ] CORS headers are properly configured
- [ ] Login page loads without errors
- [ ] Can successfully log in and get redirected

---

## 🔒 Security Best Practices

1. **Never store plain text passwords** - Always use bcrypt
2. **Use strong API keys** - Change default keys in production
3. **Enable HTTPS** - Use SSL certificates in production
4. **Limit login attempts** - Implement rate limiting (future enhancement)
5. **Secure localStorage** - Consider using httpOnly cookies for production
6. **Validate all inputs** - Both client and server-side
7. **Log authentication attempts** - Monitor for suspicious activity

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Check server error logs: `public_html/api_error.log`
3. Test the API directly using Postman or curl
4. Verify all environment variables are loaded

---

**Last Updated:** January 29, 2026
**Status:** ✅ Production Ready
