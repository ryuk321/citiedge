# Ofqual-Regulated Courses System

## Overview
This system manages enrollment applications for OTHM/QUALIFI Ofqual-regulated courses (Level 3-8). It includes a course overview page, an enrollment form, database integration, and an API for processing applications.

---

## 📁 File Structure

```
pages/
├── ofqual-courses/
│   ├── overview.tsx              # Course overview page
│   ├── enrollment-form.tsx       # Multi-section enrollment form
│   └── thank-you.tsx            # Thank you/confirmation page
│
├── api/
│   └── ofqual/
│       └── enroll.ts            # API endpoint for form submission
│
Database Instruction/
└── create_ofqual_enrollments_table.sql  # Database setup SQL
│
lib/
└── DB_Table.ts                  # TypeScript interface for OfqualEnrollment
│
public_html/
└── student_api.php              # PHP API with Ofqual endpoints
```

---

## 🚀 Quick Setup Guide

### Step 1: Create Database Table

Run the SQL script to create the enrollment table:

```bash
mysql -u citiedge_portal -p citiedge_portal < "Database Instruction/create_ofqual_enrollments_table.sql"
```

Or manually copy and execute the SQL from:
`Database Instruction/create_ofqual_enrollments_table.sql`

This will create:
- `ofqual_enrollments` table with all required fields
- Auto-generated application reference trigger (e.g., OFQ2026-0001)
- Indexes for performance

### Step 2: Verify Database Connection

The system uses the existing database connection in `public_html/student_api.php`:
- Host: localhost
- Database: citiedge_portal
- User: citiedge_portal

### Step 3: Update API Configuration (Optional)

If needed, update the API base URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost/citiedge-portals/public_html
API_KEY=super-secret-key
```

### Step 4: Test the System

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   - Overview: `http://localhost:3000/ofqual-courses/overview`
   - Enrollment Form: `http://localhost:3000/ofqual-courses/enrollment-form`

---

## 📋 Features

### Course Overview Page (`overview.tsx`)
- ✅ Qualification levels table (Level 3-8)
- ✅ 10 course categories with expandable details
- ✅ Search functionality
- ✅ Links to enrollment form with pre-filled category
- ✅ Responsive design
- ✅ Modern gradient UI

### Enrollment Form (`enrollment-form.tsx`)
- ✅ 8-section multi-step form
- ✅ Progress bar indicator
- ✅ Client-side validation
- ✅ GDPR compliance checkboxes
- ✅ Section-by-section navigation
- ✅ Easy to edit form fields

### Database (`ofqual_enrollments`)
- ✅ All OTHM/QUALIFI required fields
- ✅ Auto-generated application reference
- ✅ Application status tracking
- ✅ Reviewer notes and audit trail
- ✅ GDPR consent tracking

### API Endpoints
- `POST /api/ofqual/enroll` - Submit new enrollment
- `GET ?action=getOfqualEnrollments` - List all enrollments
- `GET ?action=getOfqualEnrollmentById&id=X` - Get specific enrollment
- `POST ?action=updateOfqualEnrollmentStatus` - Update application status

---

## 🎨 Customization Guide

### 1. Adding/Editing Courses

**File:** `pages/ofqual-courses/overview.tsx`

Find the `courseCategories` array (around line 27):

```typescript
const courseCategories = [
  {
    id: 1,
    name: "Business and Management",
    icon: "💼",
    color: "blue",
    levels: [
      {
        level: "4",
        courses: [
          "Diploma in Management and Leadership",
          // Add more courses here
        ]
      }
    ],
    targetAudience: "Your target audience description"
  },
  // Add more categories here
];
```

### 2. Modifying Form Fields

**File:** `pages/ofqual-courses/enrollment-form.tsx`

To add a new field:

1. Add to the `EnrollmentFormData` interface:
```typescript
interface EnrollmentFormData {
  // ... existing fields
  newField: string;  // Add your new field
}
```

2. Add to initial state:
```typescript
const [formData, setFormData] = useState<EnrollmentFormData>({
  // ... existing fields
  newField: '',  // Initialize your field
});
```

3. Add input in the appropriate section:
```typescript
<input
  type="text"
  name="newField"
  value={formData.newField}
  onChange={handleInputChange}
  className="w-full px-4 py-3 border..."
/>
```

### 3. Styling Changes

The system uses **Tailwind CSS**. All styling is inline with utility classes.

Common color schemes:
- Primary: `bg-blue-600`, `text-blue-600`
- Success: `bg-green-600`, `text-green-600`
- Warning: `bg-yellow-600`, `text-yellow-600`

To change the main theme, search and replace color classes globally.

### 4. Database Fields

If you add fields to the form, also update:

1. **Database Table:** Add column in SQL
```sql
ALTER TABLE ofqual_enrollments 
ADD COLUMN new_field VARCHAR(255);
```

2. **TypeScript Interface:** Update `lib/DB_Table.ts`
```typescript
export interface OfqualEnrollment {
  // ... existing fields
  new_field?: string;
}
```

3. **PHP API:** Update `public_html/student_api.php` insert query

---

## 📊 Database Schema

### Table: `ofqual_enrollments`

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key |
| application_ref | VARCHAR(50) | Auto-generated (e.g., OFQ2026-0001) |
| full_legal_name | VARCHAR(255) | Applicant's full name |
| email | VARCHAR(255) | Contact email |
| qualification_level | ENUM | Level 3-8 |
| awarding_organisation | ENUM | OTHM/QUALIFI |
| application_status | ENUM | pending/approved/rejected/enrolled |
| ... | ... | (see SQL file for full schema) |

---

## 🔐 Security Features

- ✅ API key authentication for PHP endpoints
- ✅ CORS headers configured
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (React auto-escaping)
- ✅ GDPR consent tracking
- ✅ IP address and user agent logging

---

## 🧪 Testing

### Test the Form Submission

1. Fill out the enrollment form
2. Check browser console for API response
3. Verify database entry:
```sql
SELECT * FROM ofqual_enrollments ORDER BY id DESC LIMIT 1;
```

### Test API Endpoints

Using curl or Postman:

```bash
# Get all enrollments
curl -X GET "http://localhost/citiedge-portals/public_html/student_api.php?action=getOfqualEnrollments" \
  -H "X-API-KEY: super-secret-key"

# Get specific enrollment
curl -X GET "http://localhost/citiedge-portals/public_html/student_api.php?action=getOfqualEnrollmentById&id=1" \
  -H "X-API-KEY: super-secret-key"
```

---

## 📧 Email Integration (TODO)

The system includes a placeholder for email confirmation. To implement:

1. Install email service (e.g., Nodemailer, SendGrid)
2. Update `pages/api/ofqual/enroll.ts`:
```typescript
async function sendConfirmationEmail(email: string, applicationRef: string) {
  // Your email sending logic here
}
```

---

## 🔄 Application Workflow

```
1. Student visits overview page → Browses courses
2. Student clicks "Apply Now" → Opens enrollment form
3. Student fills 8 sections → Validates each section
4. Student submits form → Saves to database
5. System generates ref number → Redirects to thank you page
6. Email sent (optional) → Student receives confirmation
7. Admin reviews application → Updates status
8. Student enrolled → Assigned student ID
```

---

## 🐛 Troubleshooting

### Form submission fails
- Check browser console for errors
- Verify API endpoint URL in `.env.local`
- Check PHP error log: `public_html/api_error.log`

### Database errors
- Verify table exists: `SHOW TABLES LIKE 'ofqual_enrollments';`
- Check connection credentials in `student_api.php`

### Styling issues
- Run `npm run dev` to ensure Tailwind is compiling
- Check for class name typos

---

## 📞 Support

For issues or questions:
- Email: tech@citiedge.edu
- Documentation: `/Project Instructions Readme/`

---

## 🎯 Future Enhancements

- [ ] Admin dashboard for reviewing applications
- [ ] Email notifications
- [ ] Document upload functionality
- [ ] Payment integration
- [ ] Student portal integration
- [ ] Bulk import/export
- [ ] Advanced search and filtering

---

## 📝 Changelog

**Version 1.0 (January 2026)**
- Initial release
- Course overview page
- 8-section enrollment form
- Database integration
- API endpoints
- Thank you page

---

**Last Updated:** January 9, 2026
