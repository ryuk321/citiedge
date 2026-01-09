# QUICK SETUP GUIDE - OFQUAL COURSES SYSTEM

## ⚡ 3-Step Setup (5 Minutes)

### STEP 1: Run Database Setup
Open your MySQL client and execute:

```sql
-- Connect to your database
USE citiedge_portal;

-- Copy and paste the entire contents of:
-- Database Instruction/create_ofqual_enrollments_table.sql
-- Or run via command line:
```

**Command line option:**
```bash
cd "C:\Users\loken\Documents\CITIEDGE\citiedg-portals"
mysql -u citiedge_portal -p citiedge_portal < "Database Instruction/create_ofqual_enrollments_table.sql"
```

This creates the `ofqual_enrollments` table with auto-generated application references.

---

### STEP 2: Verify Files Created

Check that these files exist:
- ✅ `pages/ofqual-courses/overview.tsx`
- ✅ `pages/ofqual-courses/enrollment-form.tsx`
- ✅ `pages/ofqual-courses/thank-you.tsx`
- ✅ `pages/api/ofqual/enroll.ts`
- ✅ `Database Instruction/create_ofqual_enrollments_table.sql`
- ✅ `lib/DB_Table.ts` (updated with OfqualEnrollment interface)
- ✅ `public_html/student_api.php` (updated with Ofqual endpoints)

---

### STEP 3: Test the System

1. **Start Development Server:**
```bash
npm run dev
```

2. **Visit the Pages:**
- Overview: http://localhost:3000/ofqual-courses/overview
- Form: http://localhost:3000/ofqual-courses/enrollment-form

3. **Test Form Submission:**
- Fill out the enrollment form (all 8 sections)
- Submit and check the thank you page
- Verify database entry:
```sql
SELECT application_ref, full_legal_name, email, qualification_title, application_status 
FROM ofqual_enrollments 
ORDER BY id DESC LIMIT 5;
```

---

## 🎯 What You Get

### 1. Course Overview Page
- **URL:** `/ofqual-courses/overview`
- **Features:**
  - 10 course categories (Business, IT, Health, etc.)
  - Levels 3-8 displayed
  - Search functionality
  - Expandable course details
  - Direct links to enrollment form

### 2. Enrollment Form
- **URL:** `/ofqual-courses/enrollment-form`
- **Features:**
  - 8 sections with progress bar
  - Client-side validation
  - GDPR compliant
  - Saves to database
  - Auto-generated application reference

### 3. Thank You Page
- **URL:** `/ofqual-courses/thank-you`
- **Shows:** Application reference, next steps, contact info

---

## 📊 Database Table

**Table Name:** `ofqual_enrollments`

**Key Fields:**
- `application_ref` - Auto-generated (OFQ2026-0001, OFQ2026-0002, etc.)
- `application_status` - pending, under_review, approved, rejected, enrolled
- Personal details, qualification info, GDPR consent, etc.

**Auto-Generated Reference:**
- Format: `OFQ[YEAR]-[NUMBER]`
- Example: `OFQ2026-0001`
- Generated automatically via database trigger

---

## 🔧 Easy Customization

### Add/Edit Courses
**File:** `pages/ofqual-courses/overview.tsx`
- Find `courseCategories` array (line ~27)
- Add new category or courses to existing levels

### Modify Form Fields
**File:** `pages/ofqual-courses/enrollment-form.tsx`
- Update `EnrollmentFormData` interface
- Add input fields in appropriate sections
- Update API endpoint if needed

### Change Colors/Design
- All styling uses Tailwind CSS
- Search for color classes (e.g., `bg-blue-600`) and replace globally
- Main colors: blue (primary), green (success), red (error)

---

## 📝 Quick Database Queries

**View Recent Applications:**
```sql
SELECT application_ref, full_legal_name, email, qualification_title, 
       application_status, submission_date
FROM ofqual_enrollments 
ORDER BY submission_date DESC 
LIMIT 10;
```

**Count by Status:**
```sql
SELECT application_status, COUNT(*) as count 
FROM ofqual_enrollments 
GROUP BY application_status;
```

**Find Applications Requiring Adjustments:**
```sql
SELECT application_ref, full_legal_name, adjustment_details
FROM ofqual_enrollments
WHERE requires_adjustments = 'Yes';
```

**Update Application Status:**
```sql
UPDATE ofqual_enrollments 
SET application_status = 'approved',
    reviewer_notes = 'Approved for enrollment'
WHERE application_ref = 'OFQ2026-0001';
```

---

## 🔌 API Endpoints

All endpoints in `public_html/student_api.php` require header:
```
X-API-KEY: super-secret-key
```

### 1. Create Enrollment
```
POST ?action=createOfqualEnrollment
Body: JSON with enrollment data
```

### 2. Get All Enrollments
```
GET ?action=getOfqualEnrollments&status=pending&limit=50
```

### 3. Get Specific Enrollment
```
GET ?action=getOfqualEnrollmentById&id=1
```

### 4. Update Status
```
POST ?action=updateOfqualEnrollmentStatus
Body: { "id": 1, "status": "approved", "reviewer_notes": "..." }
```

---

## ✅ Testing Checklist

- [ ] Database table created successfully
- [ ] Can access overview page
- [ ] Can access enrollment form
- [ ] Can navigate through all 8 sections
- [ ] Form validation works
- [ ] Can submit form successfully
- [ ] Thank you page displays
- [ ] Database entry created with application_ref
- [ ] API endpoints respond correctly

---

## 🚨 Common Issues & Fixes

### Issue: "Table doesn't exist"
**Fix:** Run the SQL script from `Database Instruction/create_ofqual_enrollments_table.sql`

### Issue: "API key forbidden"
**Fix:** Check that `X-API-KEY` header is set to `super-secret-key` in `student_api.php`

### Issue: Form submission fails
**Fix:** 
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Check PHP error log at `public_html/api_error.log`

### Issue: Styles not loading
**Fix:** Restart dev server: `npm run dev`

---

## 📁 Folder Structure Created

```
pages/ofqual-courses/
├── overview.tsx           ← Course catalog
├── enrollment-form.tsx    ← 8-section application form
├── thank-you.tsx         ← Confirmation page
└── README.md             ← Full documentation

pages/api/ofqual/
└── enroll.ts             ← Form submission API

Database Instruction/
└── create_ofqual_enrollments_table.sql  ← Database setup
```

---

## 🎨 Design Features

- ✅ Modern gradient backgrounds
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Smooth transitions and hover effects
- ✅ Progress bar for form completion
- ✅ Section-by-section validation
- ✅ Icons and visual feedback
- ✅ Consistent with existing portal design

---

## 📞 Need Help?

**Documentation:** See `pages/ofqual-courses/README.md` for full details

**Code is organized and commented for easy modification!**

---

**Setup Time:** ~5 minutes  
**Last Updated:** January 9, 2026  
**Status:** Ready to use! 🚀
