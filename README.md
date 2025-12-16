# Citiedge University Portal

A comprehensive portal system for Citiedge University providing dedicated interfaces for:
- **Student Portal**: Access courses, grades, timetable, and upload assignments (UK University Moodle-style)
- **Agent Portal**: Manage applications and student interactions
- **Staff Portal**: Administrative tools and document management
- **Alumni Portal**: Network access and engagement tools
- **Admin Portal**: Manage students, courses, and system settings

## 🆕 Latest Update: Interactive Login with Tailwind CSS

**New Features:**
- Modern, animated login page with Tailwind CSS
- Password visibility toggle
- Social login integration (Google, Microsoft)
- Guest access option
- Session-based authentication
- Loading states and smooth transitions

## Features

### Login & Authentication
- 🔐 **Interactive Login Page**: Modern design with Tailwind CSS
- 🎨 **Animated Background**: Floating elements with smooth animations
- 👁️ **Password Toggle**: Show/hide password functionality
- 🌐 **Social Login**: Google and Microsoft SSO ready
- 👤 **Guest Access**: Quick access without credentials
- 🔄 **Session Management**: Secure authentication flow

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
- **Tailwind CSS**: Modern utility-first CSS framework

## Project Structure

```
citiedge/
├── login.html                  # NEW: Interactive login page
├── portal-selection.html       # NEW: Portal selection with auth
├── index.html                  # Redirects to login
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

### Quick Start
1. Open `index.html` in a web browser
2. You'll be redirected to the login page
3. Enter any credentials or click "Continue as Guest"
4. Select your portal from the portal selection page
5. Navigate through the features

### Login Page Features
- **Username/Email**: Enter any value (demo mode)
- **Password**: Enter any value (demo mode)
- **Remember Me**: Optional checkbox
- **Social Login**: Google/Microsoft buttons (demo)
- **Guest Access**: Skip login entirely

### Direct Access
- Login: `login.html`
- Portal Selection: `portal-selection.html`
- Student Portal: `student-portal-new.html`
- Admin Portal: `admin-portal.html`

## Technical Details

- **Pure JavaScript**: No build tools required
- **Tailwind CSS**: Loaded via CDN
- **Component-Based Architecture**: Reusable components for consistent UI
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Mock API**: Simulated backend for demonstration purposes

## Development

The portal uses a component-based architecture:

- **Components** (`components/components.js`): Reusable UI elements (cards, tables, modals, etc.)
- **API Layer** (`api/api.js`): Data access methods (in production, these would be HTTP requests)
- **Styles**: Tailwind CSS + modular CSS with component-specific styles

## Documentation

- `LOGIN_PAGE.md` - Login page features and design
- `ARCHITECTURE.md` - Complete architecture guide
- `FEATURES.md` - Feature documentation
- `VISUAL_GUIDE.md` - Visual design reference
- `README.md` - This file

## Future Enhancements

- Backend integration with real database
- Real authentication and authorization
- Two-factor authentication
- Real-time notifications
- Email integration
- Advanced reporting
- Mobile app
