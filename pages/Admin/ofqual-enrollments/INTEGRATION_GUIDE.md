# Ofqual Admin Integration Guide

## ✅ What Was Created

### 1. Component Files (5 files)
Location: `pages/Admin/ofqual-enrollments/`

- ✅ **OfqualEnrollmentsPage.tsx** - Main orchestrator component
- ✅ **EnrollmentStats.tsx** - Statistics dashboard (4 cards)
- ✅ **EnrollmentFilters.tsx** - Search and filter controls
- ✅ **EnrollmentsTable.tsx** - GitHub-style data table
- ✅ **EnrollmentDetails.tsx** - Full-screen detail modal
- ✅ **README.md** - Complete documentation

### 2. Admin Menu Integration
File: `pages/Admin/adminpage.tsx`

- ✅ Added import for `OfqualEnrollmentsPage`
- ✅ Added "Ofqual Enrollments" menu item with document icon
- ✅ Added 2 sub-menu items: "All Enrollments" and "Statistics"
- ✅ Added routing cases in `renderContent()` function

### 3. API Endpoint
File: `public_html/student_api.php`

- ✅ Added `deleteOfqualEnrollment` endpoint
- ✅ Handles GET request with `id` parameter
- ✅ Validates enrollment exists before deletion
- ✅ Returns success message with deleted reference

---

## 🚀 How to Access

### Step 1: Login
Navigate to admin login page and sign in with admin credentials.

### Step 2: Find Menu Item
In the left sidebar, scroll down to find **"Ofqual Enrollments"** (below "Users").

### Step 3: Expand Menu
Click on "Ofqual Enrollments" to expand sub-menu.

### Step 4: Select View
Choose either:
- **All Enrollments** - Full interface with table and actions
- **Statistics** - Same view (stats shown at top regardless)

---

## 🎨 Features Overview

### Statistics Cards
At the top of the page, you'll see 4 cards:
- **Total Enrollments** (Blue) - Count of all applications
- **Pending Review** (Yellow) - Awaiting admin action
- **Approved** (Green) - Ready for enrollment
- **Enrolled** (Purple) - Successfully enrolled students

### Filter Controls
Below stats, filter section with:
- **Search Bar** - Search by name, email, or application reference
- **Status Dropdown** - Filter by application status
- **Level Dropdown** - Filter by course level (3-8)
- **Organisation Dropdown** - Filter by OTHM or QUALIFI
- **Clear Filters Button** - Reset all filters at once

### Data Table (GitHub Style)
Clean, modern table showing:
- Application reference (clickable)
- Student name
- Contact info (email + phone)
- Course category
- Level
- Organisation badge
- Status badge (color-coded)
- Applied date
- Action buttons (status dropdown, view, delete)

**Interactions**:
- Hover over rows to highlight
- Click anywhere on row to open details
- Use quick status dropdown in Actions column
- Click eye icon to view full details
- Click trash icon to delete (with confirmation)

### Details Modal
Click any row to open full-screen modal with:
- Large status update section at top
- 12 organized sections with all enrollment data
- Inline status update dropdown
- Scroll through all information
- Close with X button or click outside

---

## 📋 Common Tasks

### View All Enrollments
1. Click "Ofqual Enrollments" in sidebar
2. Click "All Enrollments"
3. See table with all applications

### Search for a Student
1. Type name, email, or ref in search bar
2. Results filter in real-time

### Filter by Status
1. Click "Status" dropdown
2. Select status (e.g., "Pending")
3. Table updates to show only pending applications

### Update Status (Quick)
1. Find enrollment in table
2. Click status dropdown in Actions column
3. Select new status
4. Status updates immediately

### Update Status (From Details)
1. Click on enrollment row
2. Modal opens with full details
3. Use status dropdown at top
4. Select new status
5. Status updates, modal stays open

### View Full Details
1. Click eye icon in Actions column, OR
2. Click anywhere on the row
3. Scroll through all sections
4. Close when done

### Delete an Enrollment
1. Click trash icon in Actions column
2. Confirm deletion in alert
3. Enrollment removed from database
4. Table refreshes automatically

### Clear All Filters
1. Click "Clear Filters" button
2. All filters reset to "All"
3. Search bar clears
4. Full list displays

---

## 🎯 Status Management

### Status Values
Applications can have 6 statuses:

1. **pending** - Just submitted, awaiting review
2. **under_review** - Admin is currently reviewing
3. **approved** - Application accepted, ready for enrollment
4. **enrolled** - Student successfully enrolled in course
5. **rejected** - Application declined
6. **withdrawn** - Student withdrew application

### Recommended Flow
```
pending → under_review → approved → enrolled
        ↓
     rejected
        ↓
     withdrawn (can happen at any stage)
```

### Updating Status
Status can be updated in two ways:
1. **Quick Update**: Dropdown in table Actions column
2. **Detail Update**: Dropdown in details modal

Both methods:
- Save immediately to database
- Refresh display automatically
- Show success/error messages

---

## 🔍 Filter Examples

### Find Pending Applications
- Status: "Pending"
- See all new applications needing review

### Find Level 7 Business Courses
- Level: "Level 7"
- Search: "Business"
- See advanced business qualifications

### Find OTHM Enrollments
- Organisation: "OTHM"
- See all OTHM awarding body applications

### Complex Search
- Status: "Approved"
- Level: "Level 6"
- Organisation: "QUALIFI"
- See approved Level 6 QUALIFI applications

---

## 📊 Data Displayed

### In Table (9 columns):
1. Application Reference
2. Student Name
3. Contact (Email + Phone)
4. Course Category
5. Level
6. Organisation
7. Status Badge
8. Applied Date
9. Actions

### In Details Modal (12 sections):
1. Status Update Section
2. Personal Information (7 fields)
3. Contact Information (7 fields)
4. Emergency Contact (3 fields)
5. ID Verification (3 fields)
6. Course Details (6 fields)
7. Previous Qualifications (3 fields)
8. Entry Requirements (2 fields)
9. Equality & Diversity (3 fields)
10. Special Adjustments (conditional)
11. Consent & Declaration (5 fields)
12. System Information (3 fields)

---

## ⚙️ Technical Details

### Component Architecture
```
OfqualEnrollmentsPage (Parent)
├── EnrollmentStats (Child)
├── EnrollmentFilters (Child)
├── EnrollmentsTable (Child)
└── EnrollmentDetails (Modal, conditional)
```

### Data Flow
1. Parent component loads data from API
2. Parent manages all state (enrollments, filters, selected)
3. Parent passes data and callbacks to children
4. Children render data and trigger parent callbacks
5. Parent updates state and re-renders children

### API Calls
All API calls use:
- Base URL from `.env`: `NEXT_PUBLIC_API_BASE_URL`
- API Key from `.env`: `NEXT_PUBLIC_API_KEY`
- Authentication: `X-API-KEY` header
- Response format: JSON

---

## 🛠️ Customization

### Change Colors
Edit color classes in components:
- Stats: `EnrollmentStats.tsx` - modify `color` and `bgColor` in stats array
- Status badges: `EnrollmentsTable.tsx` - modify `getStatusBadge()` function
- Modal sections: `EnrollmentDetails.tsx` - modify icon colors in section headers

### Add New Filters
1. Add to `Filters` interface
2. Add dropdown to `EnrollmentFilters.tsx`
3. Update filtering logic in `applyFilters()`

### Add Table Columns
1. Add `<th>` in table header
2. Add `<td>` in table body
3. Map enrollment field to column

### Modify Modal Sections
1. Edit `EnrollmentDetails.tsx`
2. Add/remove `<div className="bg-gray-50 rounded-lg p-5">` sections
3. Use `<InfoRow>` component for consistent styling

---

## 🐛 Troubleshooting

### "No enrollments found"
**Causes**:
- No data in database
- API connection issue
- Wrong API endpoint

**Solutions**:
1. Check database has records: `SELECT COUNT(*) FROM ofqual_enrollments;`
2. Check `.env` file has correct API URL
3. Check browser console for errors
4. Verify API key is correct

### Status update not working
**Causes**:
- Missing enrollment ID
- Invalid status value
- API endpoint issue

**Solutions**:
1. Check enrollment has valid `id` field
2. Verify status is one of 6 valid values
3. Check `updateOfqualEnrollmentStatus` endpoint exists in `student_api.php`
4. Check network tab for API response

### Delete not working
**Causes**:
- Missing delete endpoint
- Invalid enrollment ID
- Database constraint

**Solutions**:
1. Verify `deleteOfqualEnrollment` case exists in `student_api.php`
2. Check enrollment ID is valid number
3. Check database for foreign key constraints

### Modal not opening
**Causes**:
- State not updating
- Enrollment object is null
- CSS z-index issue

**Solutions**:
1. Check `setSelectedEnrollment()` is called with valid object
2. Verify enrollment data loaded successfully
3. Check modal has `z-50` class
4. Look for console errors

### Filters not working
**Causes**:
- Field names don't match database
- Filter logic incorrect
- State not updating

**Solutions**:
1. Verify field names in `applyFilters()` match database columns
2. Check filter logic handles all cases
3. Ensure `handleFilterChange()` updates state correctly
4. Check React DevTools for state values

---

## 📚 Related Documentation

- **Component README**: `pages/Admin/ofqual-enrollments/README.md`
- **Database Setup**: `Database Instruction/create_ofqual_enrollments_table.sql`
- **Main Project Docs**: `Project Instructions Readme/`
- **API Documentation**: See comments in `public_html/student_api.php`

---

## ✨ Tips & Best Practices

### For Efficient Use:
1. **Use Search First** - Fastest way to find specific student
2. **Combine Filters** - Use multiple filters for precise results
3. **Use Quick Status** - Update status directly from table for speed
4. **Open Details When Needed** - Only open modal for full information review
5. **Clear Filters Often** - Don't forget to clear after specific searches

### For Data Management:
1. **Review Pending Daily** - Keep applications moving through workflow
2. **Update Status Promptly** - Keep status current for accurate reporting
3. **Use Under Review** - Mark applications you're actively reviewing
4. **Document Reasons** - Future update: add notes when rejecting
5. **Export Regularly** - Future update: export for backup/analysis

### For System Maintenance:
1. **Monitor Error Logs** - Check API error log regularly
2. **Backup Database** - Regular backups of `ofqual_enrollments` table
3. **Test After Updates** - Verify CRUD operations after code changes
4. **Check Performance** - If slow, consider pagination for large datasets
5. **Review Analytics** - Use stats cards to monitor application flow

---

## 🎓 Training Checklist

New admin users should practice:
- [ ] Finding menu item in sidebar
- [ ] Viewing all enrollments
- [ ] Using search to find specific student
- [ ] Filtering by status
- [ ] Filtering by multiple criteria
- [ ] Clearing filters
- [ ] Updating status from table
- [ ] Opening enrollment details
- [ ] Updating status from modal
- [ ] Reading all sections in detail modal
- [ ] Understanding status workflow
- [ ] Deleting test enrollment
- [ ] Understanding statistics cards

---

**Integration Date**: January 2025
**Version**: 1.0.0
**Support**: Check README.md in component folder
