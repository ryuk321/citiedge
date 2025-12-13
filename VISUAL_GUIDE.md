# Visual Guide - Citiedge University Portal

## Portal Selection Page

The main landing page shows 5 portal options:
- 🎓 **Student Portal** - Enhanced with UK university features
- 💼 **Agent Portal** - Application management
- 👔 **Staff Portal** - Administrative tools
- 🎖️ **Alumni Portal** - Alumni networking
- 🔧 **Admin Portal** (NEW) - Student and course management (highlighted in red)

## Admin Portal

### Dashboard View
The admin portal opens with:
- **Statistics Cards** (Top Row):
  - 👥 Total Students: Shows count with weekly trend
  - ✅ Active Students: Enrolled student count
  - 📚 Total Courses: Available courses
  - 📝 Pending Assignments: Awaiting review count

### Student Management Section
- **Table Display**:
  - Columns: ID, Name, Email, Program, Year, Status
  - Action Buttons: ✏️ Edit, 🗑️ Delete
  - Status badges with color coding (Green for Active)
- **Add New Student Button**: Opens modal dialog

### Modal Form
When clicking "Add New Student" or "Edit":
- Clean modal overlay with form
- Fields: Full Name, Email, Program, Year, Status
- Dropdown selectors for Program and Year
- Validation indicators (red asterisk for required fields)
- Cancel and Save buttons

### Course Management Section
- Table showing all courses
- Columns: Course ID, Name, Instructor, Credits, Schedule
- Read-only view (editing can be added later)

## Enhanced Student Portal

### Landing View
Opens with **Dashboard tab active** showing:
- Tab navigation bar with 5 tabs:
  - 📊 Dashboard (active)
  - 📚 My Courses (Moodle)
  - 🗓️ Timetable
  - 📝 Assignments
  - 📈 Grades

### Dashboard Tab
- **Statistics Grid** (4 cards):
  - 📚 Enrolled Courses: 4
  - 📝 Pending Assignments: Count
  - 📈 Average Grade: 93.0% (+2.5% trend)
  - ✅ Attendance: 94% (Excellent)
- **Upcoming Deadlines Section**:
  - Card for each pending assignment
  - Shows: Title, Course, Due Date, Description
  - Yellow "Due Soon" badge

### My Courses (Moodle) Tab
Each course shows as a card with:
- 📖 Icon and course name as title
- Course details: Code, Instructor, Credits, Schedule
- **Course Resources section**:
  - 📄 Lecture Notes - Week 1-5
  - 🎥 Recorded Lectures
  - 📚 Reading Materials
  - 💬 Discussion Forum
- Blue "View Course Content" button

### Timetable Tab
- **Weekly Grid Layout**:
  - Header row: Time | Monday | Tuesday | Wednesday | Thursday | Friday
  - Time slots: 09:00-10:00, 11:00-12:00, 14:00-15:00
  - **Filled cells** (light blue gradient):
    - Course code in bold purple
    - Activity type (Lecture, Lab, Tutorial, Practical)
    - Location/Room number in gray
  - **Empty cells** (light gray): Show "Free" in italics
- Color-coded borders for easy scanning
- Responsive: adjusts to mobile screens

### Assignments Tab
- **Table View**:
  - Columns: Assignment, Course, Due Date, Status, Description
  - Status badges:
    - 🟢 Green "Submitted" for completed
    - 🟡 Yellow "Pending" for upcoming
- **Submit Assignment Section** (below table):
  - Large upload area with 📁 icon
  - "Click to select files or drag and drop"
  - Supported formats listed
  - Blue "Upload Selected Files" button
  - File list shows after selection

### Grades Tab
- **Overall Performance Card** (purple gradient banner):
  - Average Grade: 93.0%
  - Total Assessments: 4
  - Classification: **First Class** (UK system)
- **Grades Table**:
  - Columns: Course, Assignment, Grade, Percentage, Status
  - Color-coded badges:
    - 🟢 Green "Excellent" for ≥70%
    - 🔵 Blue "Good" for 60-69%
    - 🟡 Yellow "Pass" for <60%

## Component Examples

### Card Component
```
┌─────────────────────────┐
│       📚 (Icon)         │
│   Course Title          │
│ ───────────────────── │
│ Content goes here       │
│ Multiple lines          │
│ ───────────────────── │
│ [Footer Button]         │
└─────────────────────────┘
```

### Table Component
```
┌────────────────────────────────────────┐
│ Header 1 │ Header 2 │ Header 3 │Actions│
├────────────────────────────────────────┤
│ Data 1   │ Data 2   │ Data 3   │[✏️][🗑️]│
│ Data 1   │ Data 2   │ Data 3   │[✏️][🗑️]│
└────────────────────────────────────────┘
```

### Stat Card
```
┌─────────────────────┐
│ 📊  Total Students  │
│     256             │
│ ↑ +5 this week      │
└─────────────────────┘
```

### Modal Dialog
```
┌───────────────────────────────────────┐
│ Add New Student                    [×] │
├───────────────────────────────────────┤
│                                        │
│ Full Name: [___________________]       │
│ Email:     [___________________]       │
│ Program:   [Dropdown ▼         ]       │
│ Year:      [Dropdown ▼         ]       │
│                                        │
├───────────────────────────────────────┤
│              [Cancel]  [Save Student]  │
└───────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Purple Gradient**: #667eea → #764ba2 (Headers, buttons)
- **White**: #ffffff (Background, cards)
- **Light Gray**: #f8f9fa (Alternate backgrounds)
- **Border Gray**: #e9ecef (Dividers)

### Status Colors
- **Success/Active**: #d4edda / #28a745 (Green)
- **Warning/Pending**: #fff3cd / #ffc107 (Yellow)
- **Danger/Error**: #f8d7da / #dc3545 (Red)
- **Info**: #d1ecf1 / #17a2b8 (Blue)

### Timetable Colors
- **Filled Cells**: #e3f2fd → #f3e5f5 (Blue-purple gradient)
- **Course Code**: #667eea (Purple)
- **Empty Cells**: #fafafa (Light gray)

## Responsive Behavior

### Desktop (>768px)
- Full grid layouts (4 columns)
- Side-by-side stat cards
- Wide timetable with all days visible

### Tablet (768px)
- 2 column grids
- Stacked stat cards
- Compressed timetable
- Touch-optimized buttons

### Mobile (<768px)
- Single column layout
- Full-width cards
- Scrollable timetable
- Larger touch targets
- Collapsible navigation

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals

2. **Screen Readers**
   - ARIA labels on all inputs
   - Role attributes on custom elements
   - Descriptive button text

3. **Visual**
   - High contrast colors
   - Focus indicators
   - Clear typography
   - Icon + text combinations

## Print Functionality

When printing (especially timetable):
- Removes navigation bars
- Removes footer
- Hides upload sections
- Optimizes for paper layout
- Prevents page breaks in tables

## Loading States

Components show loading spinners while fetching data:
```
   ⟳
Loading...
```

## Notifications

Success/Error messages appear at top:
```
┌──────────────────────────────────┐
│ ✓ Student added successfully!  [×]│
└──────────────────────────────────┘
```

Auto-dismiss after 5 seconds.
