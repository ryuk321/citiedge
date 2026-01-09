# SYSTEM ARCHITECTURE - OFQUAL COURSES

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT USER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

    [1] Student visits website
            ↓
    ┌──────────────────────┐
    │  Overview Page       │  URL: /ofqual-courses/overview
    │  - View all courses  │  File: pages/ofqual-courses/overview.tsx
    │  - Search courses    │
    │  - See levels 3-8    │
    └──────────────────────┘
            ↓ Click "Apply Now"
    ┌──────────────────────┐
    │  Enrollment Form     │  URL: /ofqual-courses/enrollment-form
    │  Section 1: Personal │  File: pages/ofqual-courses/enrollment-form.tsx
    │  Section 2: ID       │
    │  Section 3: Course   │  Features:
    │  Section 4: Entry    │  - Progress bar
    │  Section 5: Equality │  - Validation
    │  Section 6: Adjust   │  - Section navigation
    │  Section 7: GDPR     │
    │  Section 8: Declare  │
    └──────────────────────┘
            ↓ Submit Form
    ┌──────────────────────┐
    │  Next.js API         │  File: pages/api/ofqual/enroll.ts
    │  - Validates data    │
    │  - Calls PHP API     │
    └──────────────────────┘
            ↓
    ┌──────────────────────┐
    │  PHP API             │  File: public_html/student_api.php
    │  - Inserts to DB     │  Action: createOfqualEnrollment
    │  - Returns app ref   │
    └──────────────────────┘
            ↓
    ┌──────────────────────┐
    │  MySQL Database      │  Table: ofqual_enrollments
    │  - Stores data       │  Generated ref: OFQ2026-0001
    │  - Auto-generates    │
    │    application ref   │
    └──────────────────────┘
            ↓ Success
    ┌──────────────────────┐
    │  Thank You Page      │  URL: /ofqual-courses/thank-you
    │  - Shows app ref     │  File: pages/ofqual-courses/thank-you.tsx
    │  - Next steps        │
    └──────────────────────┘
            ↓ (Optional)
    ┌──────────────────────┐
    │  Email Confirmation  │  (To be implemented)
    │  - Sends to student  │
    └──────────────────────┘
```

---

## 🗂️ File Structure Map

```
citiedg-portals/
│
├── pages/
│   ├── ofqual-courses/
│   │   ├── overview.tsx              ← 📄 Course catalog page
│   │   ├── enrollment-form.tsx       ← 📝 8-section application form
│   │   ├── thank-you.tsx            ← ✅ Confirmation page
│   │   ├── README.md                ← 📖 Full documentation
│   │   └── QUICK_SETUP.md           ← ⚡ Setup guide
│   │
│   └── api/
│       └── ofqual/
│           └── enroll.ts             ← 🔌 API endpoint (Next.js)
│
├── lib/
│   └── DB_Table.ts                   ← 📊 TypeScript interfaces
│                                         (OfqualEnrollment added)
│
├── Database Instruction/
│   └── create_ofqual_enrollments_table.sql  ← 🗄️ Database setup
│
└── public_html/
    └── student_api.php               ← 🔌 PHP API (updated)
                                          Added 4 new actions:
                                          - createOfqualEnrollment
                                          - getOfqualEnrollments
                                          - getOfqualEnrollmentById
                                          - updateOfqualEnrollmentStatus
```

---

## 🔄 Data Flow

```
┌────────────────┐
│  Frontend      │  React/TypeScript/Next.js
│  (Pages)       │  - overview.tsx
│                │  - enrollment-form.tsx
│                │  - thank-you.tsx
└────────┬───────┘
         │
         │ HTTP Request
         ↓
┌────────────────┐
│  Next.js API   │  TypeScript API Route
│  (enroll.ts)   │  - Validates form data
│                │  - Adds audit info (IP, User-Agent)
└────────┬───────┘
         │
         │ HTTP Request (with API key)
         ↓
┌────────────────┐
│  PHP API       │  public_html/student_api.php
│  (Backend)     │  - Receives JSON data
│                │  - Uses prepared statements
│                │  - Inserts to database
└────────┬───────┘
         │
         │ SQL Query
         ↓
┌────────────────┐
│  MySQL         │  citiedge_portal database
│  Database      │  Table: ofqual_enrollments
│                │  - Auto-generates application_ref
│                │  - Stores all form data
│                │  - Tracks status & history
└────────────────┘
```

---

## 📋 Database Table Structure

```
ofqual_enrollments
├── id (INT, AUTO_INCREMENT, PRIMARY KEY)
├── application_ref (VARCHAR, UNIQUE) ← Auto-generated: OFQ2026-0001
│
├── SECTION 1: Personal Details
│   ├── full_legal_name
│   ├── date_of_birth
│   ├── gender
│   ├── nationality
│   ├── uln (Unique Learner Number)
│   ├── address
│   ├── postcode
│   ├── email
│   └── telephone
│
├── SECTION 2: Identification
│   ├── id_type (Passport/Driving Licence/etc.)
│   └── right_to_study_uk
│
├── SECTION 3: Qualification
│   ├── qualification_title
│   ├── qualification_level (Level 3-8)
│   ├── awarding_organisation (OTHM/QUALIFI)
│   ├── mode_of_study (Classroom/Online/etc.)
│   └── proposed_start_date
│
├── SECTION 4: Entry Requirements
│   ├── highest_qualification
│   ├── relevant_work_experience
│   ├── english_proficiency
│   └── ielts_score
│
├── SECTION 5: Equality & Diversity
│   ├── has_disability
│   ├── disability_details
│   └── ethnic_origin
│
├── SECTION 6: Reasonable Adjustments
│   ├── requires_adjustments
│   ├── adjustment_details
│   └── consent_to_share
│
├── SECTION 7: GDPR Consent
│   ├── read_privacy_notice
│   └── consent_data_processing
│
├── SECTION 8: Declaration
│   └── agree_to_policies
│
├── Application Management
│   ├── application_status (pending/approved/rejected/enrolled)
│   ├── student_id (assigned after enrollment)
│   ├── enrollment_date
│   ├── reviewer_id
│   ├── reviewer_notes
│   └── reviewed_at
│
└── Audit Trail
    ├── ip_address
    ├── user_agent
    ├── submission_date
    ├── created_at
    └── updated_at
```

---

## 🎯 Course Categories (10 Total)

```
1. 💼 Business and Management
   └── Levels: 3, 4, 5, 7

2. 🏥 Health and Social Care
   └── Levels: 4, 5, 7

3. 🏨 Hospitality and Tourism Management
   └── Levels: 4, 5, 7

4. 📚 Education and Training
   └── Levels: 4, 5, 7

5. 💻 Information Technology & Computing
   └── Levels: 4, 5, 7

6. 🦺 Health and Safety Management
   └── Levels: 4, 5, 6, 7, 8

7. 👥 Human Resource Management
   └── Levels: 4, 5, 6, 7, 8

8. 💰 Accounting and Finance
   └── Levels: 4, 5, 6, 7, 8

9. ⚖️ Law and Legal Services
   └── Levels: 4, 5, 6, 7, 8

10. 🤖 Data Science and AI
    └── Levels: 4, 5, 6, 7, 8
```

---

## 🔐 Security Layers

```
Layer 1: Frontend Validation
         ├── Required field checks
         ├── Email format validation
         ├── Section completion validation
         └── Checkbox agreement enforcement

Layer 2: Next.js API Validation
         ├── Request method check (POST only)
         ├── Data type validation
         └── Required field verification

Layer 3: PHP API Security
         ├── API key authentication (X-API-KEY header)
         ├── Prepared SQL statements
         ├── Input sanitization
         └── Error logging

Layer 4: Database Security
         ├── User permissions
         ├── ENUM constraints
         └── Foreign key relationships (optional)

Layer 5: Audit Trail
         ├── IP address logging
         ├── User agent tracking
         ├── Timestamp recording
         └── Reviewer tracking
```

---

## 📊 Application Status Workflow

```
pending
   ↓
   ├─→ under_review
   │      ↓
   │      ├─→ approved
   │      │      ↓
   │      │      └─→ enrolled (student_id assigned)
   │      │
   │      └─→ rejected
   │
   └─→ withdrawn (student request)
```

---

## 🛠️ Technology Stack

```
Frontend:
├── React (UI components)
├── Next.js (Framework & routing)
├── TypeScript (Type safety)
├── Tailwind CSS (Styling)
└── React Hooks (State management)

Backend:
├── Next.js API Routes (TypeScript)
├── PHP 7.4+ (API layer)
└── MySQL/MariaDB (Database)

Security:
├── API Key Authentication
├── CORS Headers
├── Prepared Statements
└── GDPR Compliance
```

---

## 📈 Scalability Features

✅ **Indexed Database Fields**
- application_ref, email, status, level, submission_date

✅ **Pagination Support**
- API accepts limit & offset parameters

✅ **Status Filtering**
- Query by application status

✅ **Full-Text Search**
- Search by name, email, qualification

✅ **Modular Code Structure**
- Easy to extend with new sections
- Reusable form components

---

## 🎨 UI/UX Features

```
Overview Page:
├── Hero section with CTA
├── Qualification levels table
├── Key features grid (6 items)
├── Course search bar
├── Expandable course cards
├── Category filtering
└── Responsive design

Enrollment Form:
├── 8-section wizard
├── Progress bar (visual feedback)
├── Section validation
├── Previous/Next navigation
├── Required field indicators (*)
├── Conditional field display
├── Submit button (final section)
└── Mobile-responsive layout

Thank You Page:
├── Success animation
├── Application reference display
├── Next steps timeline
├── Contact information
└── Navigation links
```

---

## 🔌 API Integration Points

```
1. Form Submission
   POST /api/ofqual/enroll
   Body: EnrollmentFormData
   Response: { success, applicationRef }

2. List Enrollments (for admin)
   GET /student_api.php?action=getOfqualEnrollments&status=pending
   Response: { success, enrollments[] }

3. Get Single Enrollment
   GET /student_api.php?action=getOfqualEnrollmentById&id=1
   Response: { success, enrollment }

4. Update Status (for admin)
   POST /student_api.php?action=updateOfqualEnrollmentStatus
   Body: { id, status, reviewer_notes }
   Response: { success, message }
```

---

**Created:** January 9, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
