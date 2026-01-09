# Ofqual Enrollments Admin Interface

This folder contains the admin interface for managing Ofqual-regulated course enrollments (OTHM/QUALIFI).

## 📁 Folder Structure

```
ofqual-enrollments/
├── OfqualEnrollmentsPage.tsx    # Main page component with state management
├── EnrollmentStats.tsx          # Statistics cards (Total, Pending, Approved, Enrolled)
├── EnrollmentFilters.tsx        # Filter controls (Search, Status, Level, Organisation)
├── EnrollmentsTable.tsx         # GitHub-style data table with CRUD actions
├── EnrollmentDetails.tsx        # Modal for viewing full enrollment details
└── README.md                    # This file
```

## 🚀 Quick Start

The admin interface has been integrated into the main admin panel at `/pages/Admin/adminpage.tsx`.

### Accessing the Interface

1. Navigate to the admin panel (requires admin/super_admin role)
2. Click on **"Ofqual Enrollments"** in the left sidebar
3. Choose from:
   - **All Enrollments**: View and manage all enrollment applications
   - **Statistics**: Same view (shows stats at the top)

## 🎨 Component Overview

### 1. OfqualEnrollmentsPage.tsx (Main Component)

**Purpose**: Orchestrates all child components and manages application state.

**Key Features**:
- Loads enrollment data from API
- Client-side filtering
- Status updates
- Delete operations
- Modal state management

**State Management**:
```typescript
const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [filters, setFilters] = useState<Filters>({
  status: 'all',
  level: 'all',
  organisation: 'all',
  searchTerm: ''
});
```

**API Methods**:
- `loadEnrollments()`: Fetches all enrollments from database
- `handleUpdateStatus(id, status)`: Updates enrollment status
- `handleDelete(id)`: Deletes an enrollment

---

### 2. EnrollmentStats.tsx

**Purpose**: Displays key metrics at a glance.

**Stats Displayed**:
- **Total Enrollments**: All applications submitted
- **Pending Review**: Applications awaiting review
- **Approved**: Applications approved for enrollment
- **Enrolled**: Students successfully enrolled

**Design**: 
- 4-column grid (responsive: 1 column on mobile, 2 on tablet, 4 on desktop)
- Color-coded icons and backgrounds
- SVG icons for visual appeal

---

### 3. EnrollmentFilters.tsx

**Purpose**: Provides filtering and search capabilities.

**Filter Options**:
1. **Search**: Text search across name, email, application reference
2. **Status**: Filter by application status (All, Pending, Under Review, Approved, Rejected, Enrolled, Withdrawn)
3. **Level**: Filter by course level (All, Level 3-8)
4. **Organisation**: Filter by awarding body (All, OTHM, QUALIFI)

**Features**:
- Real-time filtering as user types
- Clear Filters button to reset all
- Clean, modern form design

---

### 4. EnrollmentsTable.tsx

**Purpose**: Displays enrollments in a GitHub-style table.

**Columns**:
1. **Application Ref**: Unique reference (e.g., OFQ2026-0001)
2. **Student Name**: Full name from application
3. **Contact**: Email and phone
4. **Course**: Course category
5. **Level**: Course level (3-8)
6. **Organisation**: OTHM or QUALIFI
7. **Status**: Color-coded status badge
8. **Applied Date**: Submission date
9. **Actions**: Quick actions dropdown

**Features**:
- **Row Hover**: Entire row highlights on hover
- **Click to View**: Click anywhere on row to open details modal
- **Quick Status Update**: Dropdown to change status directly from table
- **View Details**: Eye icon to open full details modal
- **Delete**: Trash icon with confirmation prompt
- **Empty State**: Shows friendly message when no results

**Status Colors**:
- Pending: Yellow
- Under Review: Blue
- Approved: Green
- Rejected: Red
- Enrolled: Purple
- Withdrawn: Gray

---

### 5. EnrollmentDetails.tsx

**Purpose**: Full-screen modal showing complete enrollment information.

**Sections Displayed**:
1. **Status Update**: Current status with inline update dropdown
2. **Personal Information**: Title, name, DOB, gender, nationality
3. **Contact Information**: Address, email, phone
4. **Emergency Contact**: Name, phone, relationship
5. **ID Verification**: ID type, number, NI number
6. **Course Details**: Category, level, study mode, start date, funding
7. **Previous Qualifications**: Highest qualification, institution, year
8. **Entry Requirements**: Meets requirements, English proficiency
9. **Equality & Diversity**: Ethnicity, disability information
10. **Special Adjustments**: Required adjustments and details
11. **Consent & Declaration**: GDPR, marketing, data sharing, signature
12. **System Information**: Created date, last updated, IP address

**Features**:
- **Backdrop Click**: Close modal by clicking outside
- **Close Button**: X button in header
- **Scrollable Content**: Max height 90vh with scrolling
- **Color-Coded Status**: Large status banner at top
- **Inline Status Update**: Update status without leaving modal
- **Organized Sections**: Each section has icon and clear heading
- **Responsive Grid**: 1-3 columns depending on screen size

---

## 🔌 API Integration

### Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/public_html';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key';
```

### Endpoints Used

#### 1. Get All Enrollments
```typescript
GET /student_api.php?action=getOfqualEnrollments&status=all&limit=1000
Headers: { 'X-API-KEY': API_KEY }
Response: {
  success: boolean,
  count: number,
  enrollments: Enrollment[]
}
```

#### 2. Update Enrollment Status
```typescript
POST /student_api.php?action=updateOfqualEnrollmentStatus
Headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' }
Body: {
  id: number,
  status: string,
  reviewer_id?: number,
  reviewer_notes?: string
}
Response: {
  success: boolean,
  message: string
}
```

#### 3. Delete Enrollment
```typescript
GET /student_api.php?action=deleteOfqualEnrollment&id=123
Headers: { 'X-API-KEY': API_KEY }
Response: {
  success: boolean,
  message: string,
  deleted_ref: string
}
```

---

## 🎯 Status Flow

Applications go through the following statuses:

1. **pending** → Initial state when form is submitted
2. **under_review** → Admin is reviewing the application
3. **approved** → Application accepted, ready for enrollment
4. **enrolled** → Student has been enrolled in the course
5. **rejected** → Application declined
6. **withdrawn** → Student withdrew their application

---

## 🛠️ Customization Guide

### Adding New Filters

1. Add filter to `Filters` interface in `OfqualEnrollmentsPage.tsx`:
```typescript
interface Filters {
  status: string;
  level: string;
  organisation: string;
  searchTerm: string;
  newFilter: string; // Add here
}
```

2. Update `EnrollmentFilters.tsx` to include new dropdown:
```tsx
<select
  value={filters.newFilter}
  onChange={(e) => onFilterChange('newFilter', e.target.value)}
  className="..."
>
  <option value="all">All Options</option>
  <option value="option1">Option 1</option>
</select>
```

3. Update filtering logic in `applyFilters()` method:
```typescript
let filtered = enrollments.filter(enrollment => {
  // Existing filters...
  if (filters.newFilter !== 'all' && enrollment.newField !== filters.newFilter) {
    return false;
  }
  return true;
});
```

### Adding New Table Columns

Edit `EnrollmentsTable.tsx`:

```tsx
{/* Add new column header */}
<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
  New Column
</th>

{/* Add new column data in tbody */}
<td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-900">{enrollment.newField}</div>
</td>
```

### Adding New Stats

Edit `EnrollmentStats.tsx`:

```tsx
const stats = [
  // Existing stats...
  {
    label: 'New Stat',
    value: enrollments.filter(e => e.someCondition).length,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    icon: (
      <svg>...</svg>
    )
  }
];
```

### Customizing Modal Sections

Edit `EnrollmentDetails.tsx` to add new sections:

```tsx
{/* New Section */}
<div className="bg-gray-50 rounded-lg p-5">
  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
    <svg className="w-5 h-5 mr-2 text-blue-600">...</svg>
    New Section Title
  </h3>
  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
    <InfoRow label="Field 1" value={enrollment.field1} />
    <InfoRow label="Field 2" value={enrollment.field2} />
  </dl>
</div>
```

---

## 🎨 Design System

### Colors

**Status Colors**:
```css
pending:      yellow-600, yellow-50, yellow-200
under_review: blue-600,   blue-50,   blue-200
approved:     green-600,  green-50,  green-200
rejected:     red-600,    red-50,    red-200
enrolled:     purple-600, purple-50, purple-200
withdrawn:    gray-600,   gray-50,   gray-200
```

**UI Colors**:
```css
Primary:      blue-600
Background:   gray-50
Borders:      gray-200
Text Primary: gray-900
Text Secondary: gray-600
Hover BG:     gray-50
```

### Typography

```css
Headings:     font-bold
Body:         font-normal
Labels:       font-semibold text-xs uppercase tracking-wide
Buttons:      font-medium
```

### Spacing

```css
Section Padding:  p-5
Card Padding:     p-4
Grid Gaps:        gap-4, gap-6
Border Radius:    rounded-lg (8px)
```

---

## 📊 Data Flow

```
User Action
    ↓
OfqualEnrollmentsPage (State Management)
    ↓
API Call (student_api.php)
    ↓
Database (ofqual_enrollments table)
    ↓
Response
    ↓
State Update
    ↓
Re-render Child Components
```

---

## 🔒 Security

- **Role-Based Access**: Only `admin` and `super_admin` roles can access
- **API Key Authentication**: All API calls require `X-API-KEY` header
- **Confirmation Prompts**: Delete operations require user confirmation
- **Input Validation**: Status values validated before update
- **XSS Protection**: React automatically escapes rendered data

---

## 🐛 Troubleshooting

### Enrollments Not Loading

1. Check API endpoint URL in `.env`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost/public_html
   NEXT_PUBLIC_API_KEY=your-api-key-here
   ```

2. Verify database table exists:
   ```sql
   SHOW TABLES LIKE 'ofqual_enrollments';
   ```

3. Check API response in browser console (Network tab)

### Status Update Failing

1. Verify endpoint in `student_api.php`:
   ```php
   case 'updateOfqualEnrollmentStatus':
   ```

2. Check request payload format matches expected structure

3. Verify enrollment ID exists in database

### Filters Not Working

1. Check field names match database columns exactly
2. Verify `applyFilters()` logic in `OfqualEnrollmentsPage.tsx`
3. Ensure filter state updates correctly in `handleFilterChange()`

### Modal Not Displaying Correctly

1. Check z-index hierarchy (modal should be z-50)
2. Verify backdrop click handler is connected
3. Check if `selectedEnrollment` state is set properly

---

## 📝 Future Enhancements

Potential features to add:

1. **Bulk Actions**: Select multiple enrollments and update status at once
2. **Export to CSV**: Download enrollment data as spreadsheet
3. **Advanced Filtering**: Date range, course category multi-select
4. **Pagination**: Handle large datasets efficiently
5. **Sorting**: Click column headers to sort
6. **Notes/Comments**: Admin notes on each application
7. **Email Notifications**: Auto-email students on status change
8. **Document Upload**: Attach ID verification documents
9. **Activity History**: Log all status changes and who made them
10. **Print View**: Printer-friendly enrollment details

---

## 🔗 Related Files

- **Main Admin Page**: `pages/Admin/adminpage.tsx`
- **Database Schema**: `Database Instruction/create_ofqual_enrollments_table.sql`
- **API Endpoints**: `public_html/student_api.php`
- **TypeScript Interfaces**: `lib/DB_Table.ts`
- **Public Enrollment Form**: `pages/ofqual-courses/enrollment-form.tsx`

---

## 📞 Support

For questions or issues:
1. Check this README first
2. Review code comments in component files
3. Check database and API logs
4. Refer to main project documentation in `Project Instructions Readme/`

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained By**: CITIEDGE Development Team
