# Citiedge University Portal

A comprehensive portal system for Citiedge University providing dedicated interfaces for:
- **Student Portal**: Access courses, grades, timetable, and upload assignments (UK University Moodle-style)
- **Agent Portal**: Manage applications and student interactions
- **Staff Portal**: Administrative tools and document management
- **Alumni Portal**: Network access and engagement tools
- **Admin Portal**: Manage students, courses, and system settings

## Features

### Student Portal (UK University Style)
- 📊 **Dashboard**: Overview of courses, grades, and upcoming deadlines
- 📚 **My Courses (Moodle)**: Access course materials, lectures, and resources
- 🗓️ **Timetable**: Weekly schedule with color-coded classes
- 📝 **Assignments**: View and submit assignments with deadlines
- 📈 **Grades**: Track performance with UK grading system (First Class, Upper Second, etc.)
- Document upload with drag-and-drop support

### Admin Portal
- 👥 **Student Management**: Add, edit, and delete student records
- 📚 **Course Management**: View and manage course offerings
- 📊 **Dashboard Statistics**: Real-time overview of system metrics
- 🔧 **System Configuration**: Manage portal settings

### Architecture
- **Component-Based**: Reusable UI components in `/components` folder
- **API Layer**: Separated data access layer in `/api` folder (mock data for demo)
- **Clean Separation**: GUI and business logic are separated for maintainability

## Project Structure

```
citiedge/
├── index.html                  # Main portal selection page
├── student-portal-new.html     # Enhanced student portal
├── admin-portal.html           # Admin management portal
├── agent-portal.html           # Agent portal
├── staff-portal.html           # Staff portal
├── alumni-portal.html          # Alumni portal
├── api/
│   └── api.js                  # API layer with mock data
├── components/
│   ├── components.js           # Reusable UI components
│   └── components.css          # Component styles
├── assets/
│   ├── js/
│   │   ├── admin.js           # Admin portal logic
│   │   └── student.js         # Student portal logic
│   └── css/
│       └── enhanced.css        # Enhanced styles
├── styles.css                  # Main styles
└── portal.js                   # File upload functionality
```

## Getting Started

1. Open `index.html` in a web browser to access the portal selection page
2. Choose your portal (Student, Admin, Agent, Staff, or Alumni)
3. Navigate through the features using the tabbed interface

## Technical Details

- **Pure JavaScript**: No build tools required
- **Component-Based Architecture**: Reusable components for consistent UI
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Mock API**: Simulated backend for demonstration purposes

## Development

The portal uses a component-based architecture:

- **Components** (`components/components.js`): Reusable UI elements (cards, tables, modals, etc.)
- **API Layer** (`api/api.js`): Data access methods (in production, these would be HTTP requests)
- **Styles**: Modular CSS with component-specific styles

## Future Enhancements

- Backend integration with real database
- Authentication and authorization
- Real-time notifications
- Email integration
- Advanced reporting
- Mobile app
