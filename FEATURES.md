# Citiedge University Portal - Feature Documentation

## Overview
This document describes the enhanced Citiedge University Portal with component-based architecture, admin management, and UK university-style student features.

## Architecture

### Component-Based Design
The portal uses a modular, component-based architecture that separates concerns:

1. **GUI Layer** - HTML files for each portal
2. **Components Layer** - Reusable UI components (`/components`)
3. **API Layer** - Data access methods (`/api`)
4. **Business Logic** - Portal-specific JavaScript (`/assets/js`)

### Directory Structure
```
citiedge/
├── api/
│   └── api.js                  # Mock API with CRUD operations
├── components/
│   ├── components.js           # Reusable UI components
│   └── components.css          # Component styles
├── assets/
│   ├── js/
│   │   ├── admin.js           # Admin portal logic
│   │   └── student.js         # Student portal logic
│   └── css/
│       └── enhanced.css        # Enhanced styles
├── index.html                  # Portal selection
├── admin-portal.html           # Admin management
├── student-portal-new.html     # Enhanced student portal
└── [other portal files]
```

## Admin Portal Features

### Student Management
- **View All Students**: Comprehensive table with student information
- **Add New Student**: Modal form for creating student records
  - Name, Email, Program, Year, Status
  - Form validation
  - Auto-generated student ID
- **Edit Student**: Inline editing with pre-filled forms
- **Delete Student**: Confirmation dialog before deletion
- **Real-time Updates**: Tables refresh automatically after changes

### Dashboard Statistics
- Total Students count
- Active Students count
- Total Courses available
- Pending Assignments counter

### Course Management
- View all courses with details
- Course schedules and instructors
- Credit information

### Technical Features
- Modal-based forms (no page refresh)
- Async operations with loading states
- Success/error notifications
- Component-based tables with action buttons

## Enhanced Student Portal (UK University Style)

### Tabbed Interface
Five main tabs for easy navigation:
1. **Dashboard** - Overview and quick stats
2. **My Courses (Moodle)** - Course materials and resources
3. **Timetable** - Weekly schedule
4. **Assignments** - Submit and track assignments
5. **Grades** - View performance

### Dashboard Tab
- **Statistics Cards**:
  - Enrolled Courses count
  - Pending Assignments count
  - Average Grade percentage
  - Attendance percentage
- **Upcoming Deadlines**: Cards showing due assignments

### My Courses (Moodle-Style) Tab
- Course cards with:
  - Course code and name
  - Instructor information
  - Schedule and credits
  - **Course Resources**:
    - Lecture Notes
    - Recorded Lectures
    - Reading Materials
    - Discussion Forum
  - "View Course Content" button

### Timetable Tab
- **Weekly Grid View**:
  - Days: Monday to Friday
  - Time slots: 09:00-10:00, 11:00-12:00, 14:00-15:00
  - Color-coded cells for classes
  - Shows:
    - Course code
    - Type (Lecture, Lab, Tutorial, Practical)
    - Location/Room number
  - Free periods marked clearly
- **Responsive Design**: Adapts to mobile screens
- **Print-Friendly**: Optimized for printing

### Assignments Tab
- **Table View**:
  - Assignment title
  - Course name
  - Due date
  - Status badges (Pending/Submitted)
  - Description
- **Upload Section**:
  - Drag-and-drop file upload
  - Click to browse
  - Supported formats: PDF, DOC, DOCX, ZIP
  - File list preview

### Grades Tab
- **Overall Performance Card**:
  - Average Grade percentage
  - Total Assessments count
  - **UK Classification System**:
    - First Class (≥70%)
    - Upper Second (60-69%)
    - Lower Second (50-59%)
    - Pass (<50%)
- **Grades Table**:
  - Course name
  - Assignment name
  - Letter grade
  - Percentage
  - Performance badge

## Component Library

### Available Components
1. **Card**: General purpose card with icon, title, content, footer
2. **Table**: Data table with headers, rows, and action buttons
3. **Stat Card**: Dashboard statistics with icon, value, trend
4. **Timetable**: Weekly schedule grid
5. **Modal**: Dialog boxes for forms and confirmations
6. **Form Field**: Input, select, textarea with labels
7. **Badge**: Status indicators with colors
8. **Loader**: Loading spinner with text
9. **Alert**: Notifications (success, error, info, warning)

### Using Components
```javascript
// Example: Create a card
const cardHTML = Components.card({
    title: 'My Card',
    icon: '📚',
    content: 'Card content here',
    footer: '<button>Action</button>'
});

// Example: Create a table
const tableHTML = Components.table({
    headers: ['Name', 'Email', 'Status'],
    rows: [
        ['John', 'john@email.com', 'Active'],
        ['Jane', 'jane@email.com', 'Inactive']
    ],
    actions: [
        { label: 'Edit', type: 'info', onClick: 'editRow' }
    ]
});
```

## API Layer

### Student API
```javascript
// Get all students
const students = await API.students.getAll();

// Get student by ID
const student = await API.students.getById('S001');

// Create new student
const newStudent = await API.students.create({
    name: 'John Doe',
    email: 'john@citiedge.ac.uk',
    program: 'Computer Science',
    year: 1,
    status: 'Active'
});

// Update student
await API.students.update('S001', { year: 2 });

// Delete student
await API.students.delete('S001');
```

### Other APIs
- `API.courses.getAll()` - Get all courses
- `API.timetable.get()` - Get timetable data
- `API.assignments.getAll()` - Get all assignments
- `API.grades.getAll()` - Get all grades

## UK University Features

### Moodle-Style Course Interface
- Virtual Learning Environment (VLE) layout
- Course materials organized by type
- Discussion forums
- Lecture recordings access
- Reading materials

### Timetable System
- British university schedule format
- Morning, midday, and afternoon slots
- Different activity types (Lecture, Lab, Tutorial, Practical)
- Room/location information
- Free periods indicated

### UK Grading System
- First Class Honours (70%+)
- Upper Second Class (60-69%)
- Lower Second Class (50-59%)
- Third Class (40-49%)
- Pass/Fail

### Additional UK Features
- Academic year structure
- Module/course terminology
- British email format (@citiedge.ac.uk)
- Attendance tracking

## Responsive Design
- Mobile-friendly navigation
- Collapsible sidebars on tablets
- Touch-optimized buttons
- Readable font sizes on small screens
- Grid layouts adapt to screen size

## Accessibility
- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader compatible
- ARIA labels and roles
- Focus indicators
- High contrast colors

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
1. **Backend Integration**
   - Connect to real database
   - User authentication
   - Session management

2. **Advanced Features**
   - Real-time notifications
   - Email integration
   - Calendar sync
   - Mobile app

3. **Reporting**
   - Export grades to PDF
   - Attendance reports
   - Performance analytics

4. **Communication**
   - Messaging system
   - Announcements
   - Email notifications

## Getting Started

### For Students
1. Go to main page (index.html)
2. Click "Student Portal"
3. Navigate using tabs at the top
4. View courses, timetable, and grades
5. Submit assignments via upload

### For Admins
1. Go to main page (index.html)
2. Click "Admin Portal"
3. View dashboard statistics
4. Click "Add New Student" to create records
5. Use Edit/Delete buttons in table for management

## Technical Notes

### Mock Data
The current implementation uses mock data stored in `api/api.js`. In production:
- Replace with HTTP requests to backend API
- Add authentication tokens
- Implement proper error handling
- Add loading states

### Component Reusability
All UI components are reusable. To add new features:
1. Use existing components from `components/components.js`
2. Combine components to create complex UIs
3. Add custom styling if needed
4. Follow existing patterns for consistency

### Code Organization
- Keep portal-specific logic in `assets/js/[portal].js`
- Keep reusable code in `components/`
- Keep data operations in `api/`
- Separate concerns for maintainability
