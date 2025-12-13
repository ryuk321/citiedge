/**
 * Admin Portal JavaScript
 * Handles admin functionality for student and course management
 */

let currentStudentId = null;

// Initialize admin portal
document.addEventListener('DOMContentLoaded', async function() {
    await loadAdminStats();
    await loadStudents();
    await loadCourses();
});

/**
 * Load admin statistics
 */
async function loadAdminStats() {
    const students = await API.students.getAll();
    const courses = await API.courses.getAll();
    const assignments = await API.assignments.getAll();
    
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
    
    const statsHTML = `
        ${Components.statCard({
            label: 'Total Students',
            value: students.length,
            icon: '👥',
            trend: { type: 'up', text: '+5 this week' }
        })}
        ${Components.statCard({
            label: 'Active Students',
            value: activeStudents,
            icon: '✅',
            trend: { type: 'up', text: `${activeStudents} enrolled` }
        })}
        ${Components.statCard({
            label: 'Total Courses',
            value: courses.length,
            icon: '📚',
            trend: { type: 'up', text: 'All active' }
        })}
        ${Components.statCard({
            label: 'Pending Assignments',
            value: pendingAssignments,
            icon: '📝',
            trend: { type: 'down', text: `${pendingAssignments} awaiting review` }
        })}
    `;
    
    document.getElementById('adminStats').innerHTML = statsHTML;
}

/**
 * Load students table
 */
async function loadStudents() {
    const container = document.getElementById('studentTableContainer');
    container.innerHTML = Components.loader('Loading students...');
    
    const students = await API.students.getAll();
    
    const headers = ['ID', 'Name', 'Email', 'Program', 'Year', 'Status'];
    const rows = students.map(student => [
        student.id,
        student.name,
        student.email,
        student.program,
        `Year ${student.year}`,
        Components.badge({ 
            text: student.status, 
            type: student.status === 'Active' ? 'success' : 'default' 
        })
    ]);
    
    const actions = [
        {
            label: 'Edit',
            icon: '✏️',
            type: 'info',
            onClick: 'editStudent'
        },
        {
            label: 'Delete',
            icon: '🗑️',
            type: 'danger',
            onClick: 'deleteStudent'
        }
    ];
    
    const tableHTML = Components.table({
        headers,
        rows,
        actions,
        className: 'data-table'
    });
    
    container.innerHTML = tableHTML;
}

/**
 * Load courses table
 */
async function loadCourses() {
    const container = document.getElementById('courseTableContainer');
    container.innerHTML = Components.loader('Loading courses...');
    
    const courses = await API.courses.getAll();
    
    const headers = ['Course ID', 'Course Name', 'Instructor', 'Credits', 'Schedule'];
    const rows = courses.map(course => [
        course.id,
        course.name,
        course.instructor,
        course.credits,
        course.schedule
    ]);
    
    const tableHTML = Components.table({
        headers,
        rows,
        className: 'data-table'
    });
    
    container.innerHTML = tableHTML;
}

/**
 * Open add student modal
 */
function openAddStudentModal() {
    currentStudentId = null;
    document.getElementById('modalTitle').textContent = 'Add New Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    Components.openModal('studentModal');
}

/**
 * Edit student
 */
async function editStudent(index) {
    const students = await API.students.getAll();
    const student = students[index];
    
    if (!student) return;
    
    currentStudentId = student.id;
    document.getElementById('modalTitle').textContent = 'Edit Student';
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentProgram').value = student.program;
    document.getElementById('studentYear').value = student.year;
    document.getElementById('studentStatus').value = student.status;
    
    Components.openModal('studentModal');
}

/**
 * Save student (add or update)
 */
async function saveStudent() {
    const form = document.getElementById('studentForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const studentData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        program: document.getElementById('studentProgram').value,
        year: parseInt(document.getElementById('studentYear').value),
        status: document.getElementById('studentStatus').value
    };
    
    try {
        if (currentStudentId) {
            // Update existing student
            await API.students.update(currentStudentId, studentData);
            showNotification('Student updated successfully!', 'success');
        } else {
            // Add new student
            await API.students.create(studentData);
            showNotification('Student added successfully!', 'success');
        }
        
        Components.closeModal('studentModal');
        await loadStudents();
        await loadAdminStats();
    } catch (error) {
        showNotification('Error saving student. Please try again.', 'danger');
    }
}

/**
 * Delete student
 */
async function deleteStudent(index) {
    const students = await API.students.getAll();
    const student = students[index];
    
    if (!student) return;
    
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
        try {
            await API.students.delete(student.id);
            showNotification('Student deleted successfully!', 'success');
            await loadStudents();
            await loadAdminStats();
        } catch (error) {
            showNotification('Error deleting student. Please try again.', 'danger');
        }
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = Components.alert({
        message,
        type,
        dismissible: true
    });
    
    const main = document.querySelector('main');
    main.insertBefore(notification.firstElementChild, main.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.firstElementChild.remove();
    }, 5000);
}
