# AddStudent Modal - Usage Guide

## Overview
The AddStudent component is now a standalone modal that can be called from anywhere without needing props.

## How to Use

### 1. Import the component and function
```tsx
import AddStudent, { showAddStudentModal, setStudentsRefreshCallback } from './path/to/AddStudent';
```

### 2. Add the component to your page (once)
```tsx
function YourPage() {
  return (
    <div>
      {/* Your page content */}
      
      {/* Add this once - it manages its own visibility */}
      <AddStudent />
    </div>
  );
}
```

### 3. Call it from any button
```tsx
<button onClick={showAddStudentModal}>
  Add Student
</button>
```

### 4. (Optional) Set refresh callback
If you want the student list to refresh after adding:
```tsx
useEffect(() => {
  setStudentsRefreshCallback(() => {
    // Your refresh logic here
    loadStudents();
  });
}, []);
```

## Example Implementation

```tsx
import React, { useEffect } from 'react';
import AddStudent, { showAddStudentModal, setStudentsRefreshCallback } from './students/AddStudent';

function SomePage() {
  const loadStudents = async () => {
    // Your loading logic
  };

  // Register refresh callback
  useEffect(() => {
    setStudentsRefreshCallback(loadStudents);
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      
      {/* Button anywhere on the page */}
      <button onClick={showAddStudentModal}>
        Add New Student
      </button>
      
      {/* Add the modal component */}
      <AddStudent />
    </div>
  );
}
```

## Key Features

✅ **No props required** - Component manages its own state  
✅ **Call from anywhere** - Use `showAddStudentModal()` function  
✅ **Auto-closes** - Closes after successful submission  
✅ **Auto-refreshes** - Calls refresh callback if registered  
✅ **Modal overlay** - Full-screen modal with backdrop  
✅ **Auto-generates ID** - Student ID generated when modal opens  
✅ **Form reset** - Form resets on close or after submission  

## Migration from Old Version

**Before:**
```tsx
{showAddForm && (
  <AddStudent
    onSuccess={() => {
      loadStudents();
      setShowAddForm(false);
    }}
    onCancel={() => setShowAddForm(false)}
  />
)}
```

**After:**
```tsx
// Just add once
<AddStudent />

// Call from button
<button onClick={showAddStudentModal}>Add Student</button>
```
