# 🚀 CITIEDGE Admin Panel - Quick Start Guide

## ✅ What's Been Created

A complete, modern admin panel with:
- ✨ **GitHub-style dark sidebar** with your blue-indigo theme
- 📊 **Dashboard** with statistics and quick actions
- 👥 **Students Management** - Add, view, search, delete students
- 👨‍🏫 **Staff Management** - Manage staff members
- 📚 **E-Learning Library** - Manage library resources
- 💰 **Tuition Management** - Track payments and fees
- ✓ **Attendance Tracking** - Mark and monitor attendance

## 🎯 Quick Access

**URL**: Navigate to `/Admin/adminpage` in your browser

## 📁 Folder Structure

```
pages/Admin/
├── adminpage.tsx          ← Main layout (GitHub-style sidebar)
├── utils/api.ts           ← All API functions (easy to edit)
├── components/Dashboard.tsx
├── students/StudentsPage.tsx
├── staff/StaffPage.tsx
├── library/LibraryPage.tsx
├── tuition/TuitionPage.tsx
└── attendance/AttendancePage.tsx
```

## 🔌 API Configuration

### Your API Endpoint
```
https://citiedgecollege.co.uk/api.php?action=get
```

### How to Use
All API functions are in `utils/api.ts` - super simple!

**Example - Get Students:**
```typescript
const result = await studentsAPI.getAll();
if (result.success) {
    console.log(result.data);
}
```

**Example - Add Student:**
```typescript
const newStudent = { name: 'John', email: 'john@email.com', course: 'CS' };
await studentsAPI.create(newStudent);
```

**Example - Custom Query:**
```typescript
import { runCustomQuery } from '../utils/api';
const result = await runCustomQuery("SELECT * FROM students");
```

## ⚡ Features

### 1. **Dashboard**
- Statistics cards (students, staff, attendance, library)
- Quick action buttons
- Recent activity feed

### 2. **Each Management Section Has:**
- Search/Filter functionality
- Add new records with forms
- Table view with data
- Delete functionality
- Responsive design

### 3. **Easy to Edit**
- Clean, simple code structure
- Each section in its own file
- Copy-paste friendly
- Well-commented

## 🎨 Theme Colors

Matches your website perfectly:
- **Primary**: Blue-to-indigo gradient (`from-blue-600 to-indigo-600`)
- **Sidebar**: Dark gray (`from-gray-900 to-gray-800`)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

## 🛠️ How to Add a New Section

### Step 1: Create the page file
Create `pages/Admin/newsection/NewSectionPage.tsx`

### Step 2: Copy from existing
Copy code from any existing page (like `StudentsPage.tsx`)

### Step 3: Add to menu
In `adminpage.tsx`, add to `menuItems` array:
```typescript
{
    id: 'newsection',
    name: 'New Section',
    icon: (<svg>...</svg>),
}
```

### Step 4: Add route
In `renderContent()` function:
```typescript
case 'newsection':
    return <NewSectionPage />;
```

### Step 5: Add API functions
In `utils/api.ts`:
```typescript
export const newsectionAPI = {
    getAll: () => fetchData('getNewSection'),
    create: (data: any) => sendData('createNewSection', data),
};
```

Done! 🎉

## 📝 Common Edits

### Change a Form Field
Find the form in the page file, add your input:
```typescript
<input
    type="text"
    placeholder="Your Field"
    value={formData.yourField}
    onChange={(e) => setFormData({ ...formData, yourField: e.target.value })}
    className="px-4 py-2 border rounded-lg"
/>
```

### Change API Endpoint
Edit `utils/api.ts` line 2:
```typescript
const API_BASE_URL = 'your-new-url';
```

### Change Colors
Replace color classes:
- `bg-blue-600` → `bg-purple-600`
- `from-blue-600 to-indigo-600` → `from-red-600 to-pink-600`

## ✅ Next Steps

1. **Test the API connection** - Check browser console
2. **Customize the dashboard** - Update stats in `Dashboard.tsx`
3. **Add authentication** - Protect routes with login check
4. **Adjust forms** - Add/remove fields as needed
5. **Style tweaks** - Change colors, spacing, etc.

## 💡 Pro Tips

- Each page follows the same pattern - learn one, know all!
- Use browser DevTools to inspect and test
- Keep code simple - don't overcomplicate
- Test API calls in browser Network tab
- Read the full `README.md` for detailed documentation

## 🐛 Troubleshooting

**Nothing showing?**
- Check API endpoint is correct
- Look at browser console for errors
- Verify data format matches interfaces

**Styling broken?**
- Make sure Tailwind is installed
- Check `globals.css` is imported

**API not working?**
- Check network tab in browser
- Verify API URL in `utils/api.ts`
- Check CORS settings on server

## 📞 Need More Help?

Check the detailed `README.md` in the Admin folder for:
- Complete API documentation
- Advanced customization
- Security considerations
- More code examples

---

**Built with React + TypeScript + Tailwind CSS**
**Your CITIEDGE blue-indigo theme throughout** 🎨
