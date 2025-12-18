# CITIEDGE Admin Panel - Documentation

## 📁 File Structure

```
pages/Admin/
├── adminpage.tsx              # Main admin layout with sidebar navigation
├── utils/
│   └── api.ts                 # API utility functions for all database calls
├── components/
│   └── Dashboard.tsx          # Dashboard overview page
├── students/
│   └── StudentsPage.tsx       # Student management page
├── staff/
│   └── StaffPage.tsx          # Staff management page
├── library/
│   └── LibraryPage.tsx        # E-Learning library management
├── tuition/
│   └── TuitionPage.tsx        # Tuition records management
└── attendance/
    └── AttendancePage.tsx     # Attendance tracking page
```

## 🚀 Getting Started

### Access the Admin Panel
Navigate to: `/Admin/adminpage` in your browser

### API Configuration
The API base URL is configured in `utils/api.ts`:
```typescript
const API_BASE_URL = 'https://citiedgecollege.co.uk/api.php';
```

## 📝 How to Use the API Functions

### Simple Data Fetching
```typescript
import { studentsAPI } from '../utils/api';

// Get all students
const result = await studentsAPI.getAll();
if (result.success) {
    console.log(result.data);
}
```

### Adding New Data
```typescript
// Create a new student
const newStudent = {
    name: 'John Doe',
    email: 'john@example.com',
    course: 'Computer Science',
    status: 'active'
};

const result = await studentsAPI.create(newStudent);
```

### Custom Queries
```typescript
import { runCustomQuery } from '../utils/api';

// Run a custom SQL query
const query = "SELECT * FROM students WHERE status='active'";
const result = await runCustomQuery(query);
```

## 🎨 Color Scheme
The admin panel uses your CITIEDGE brand colors:
- **Blue to Indigo Gradient**: Main actions and highlights
- **Dark Gray Sidebar**: Professional GitHub-style sidebar
- **Status Colors**: Green (success), Yellow (warning), Red (error)

## ✏️ How to Edit Each Section

### 1. Adding a New Menu Item

Open `adminpage.tsx` and add to the `menuItems` array:

```typescript
{
    id: 'newmenu',
    name: 'New Menu',
    icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Add your icon path here */}
        </svg>
    ),
}
```

Then add the case in `renderContent()`:
```typescript
case 'newmenu':
    return <NewMenuPage />;
```

### 2. Editing Student Page

File: `students/StudentsPage.tsx`

**To change form fields:**
1. Update `formData` state (line 15)
2. Update the form inputs (line 70+)
3. Update the table headers (line 140+)

**To change API endpoint:**
Open `utils/api.ts` and modify the `studentsAPI` object.

### 3. Adding New API Function

Open `utils/api.ts`:

```typescript
export const newSectionAPI = {
    getAll: () => fetchData('getNewSection'),
    getById: (id: string) => fetchData(`getNewSection&id=${id}`),
    create: (data: any) => sendData('createNewSection', data),
    update: (id: string, data: any) => sendData('updateNewSection', { id, ...data }),
    delete: (id: string) => sendData('deleteNewSection', { id }),
};
```

### 4. Styling Changes

All components use Tailwind CSS classes. To change colors:

- **Blue buttons**: `bg-blue-600` → `bg-[color]-600`
- **Gradients**: `from-blue-600 to-indigo-600`
- **Hover effects**: `hover:bg-blue-700`

## 🔧 Common Customizations

### Change Sidebar Width
In `adminpage.tsx` line 95:
```typescript
sidebarOpen ? 'w-64' : 'w-20'  // Change 'w-64' to your desired width
```

### Change Dashboard Stats
In `components/Dashboard.tsx`, edit the stats cards (line 7+):
```typescript
<h3 className="text-3xl font-bold text-gray-900">1,234</h3>
```

### Add New Form Field
Example for Student form:
```typescript
<input
    type="text"
    placeholder="New Field"
    value={formData.newField}
    onChange={(e) => setFormData({ ...formData, newField: e.target.value })}
    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
    required
/>
```

## 📊 API Response Format

Expected API responses:
```typescript
{
    success: true,
    data: [...]  // Your data array
}

// Or on error:
{
    success: false,
    error: "Error message"
}
```

## 🛠️ Troubleshooting

### Data Not Loading?
1. Check browser console for errors
2. Verify API endpoint in `utils/api.ts`
3. Check network tab for API responses

### Styling Not Working?
1. Make sure Tailwind CSS is configured
2. Check `globals.css` is imported
3. Verify class names are correct

### Add Button Not Working?
1. Check `showAddForm` state
2. Verify form `onSubmit` handler
3. Check API function is correct

## 📱 Responsive Design
All pages are responsive:
- **Desktop**: Full sidebar + content
- **Tablet**: Collapsible sidebar
- **Mobile**: Optimized layouts

## 🔐 Security Notes
- Add authentication checks before using in production
- Validate all user inputs
- Use environment variables for API URLs
- Implement proper error handling

## 💡 Tips for Editing

1. **Keep it Simple**: Don't overcomplicate the code
2. **Use Comments**: Add comments for complex logic
3. **Test Changes**: Test each change before moving to next
4. **Follow Pattern**: Copy existing sections to create new ones
5. **Use TypeScript**: Define interfaces for type safety

## 🆘 Need Help?

Each file is structured similarly:
1. **Imports**: Required dependencies
2. **Interfaces**: TypeScript type definitions
3. **State Management**: useState hooks
4. **API Calls**: useEffect for loading data
5. **Handlers**: Functions for CRUD operations
6. **Render**: JSX for UI

Just follow this pattern when adding new features!
