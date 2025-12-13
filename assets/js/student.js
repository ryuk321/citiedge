/**
 * Enhanced Student Portal JavaScript
 * UK University-style student interface with Moodle-like features
 */

// Initialize student portal
document.addEventListener('DOMContentLoaded', async function() {
    await loadDashboard();
    await loadCourses();
    await loadTimetable();
    await loadAssignments();
    await loadGrades();
});

/**
 * Switch between tabs
 */
window.switchTab = function(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    // Add active class to clicked button
    const clickedButton = Array.from(document.querySelectorAll('.tab-button'))
        .find(btn => btn.getAttribute('onclick')?.includes(tabName));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
};

/**
 * Load dashboard with statistics
 */
async function loadDashboard() {
    const courses = await API.courses.getAll();
    const assignments = await API.assignments.getAll();
    const grades = await API.grades.getAll();
    
    const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
    const avgGrade = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
    
    const statsHTML = `
        ${Components.statCard({
            label: 'Enrolled Courses',
            value: courses.length,
            icon: '📚',
            className: 'stat-card'
        })}
        ${Components.statCard({
            label: 'Pending Assignments',
            value: pendingAssignments,
            icon: '📝',
            className: 'stat-card'
        })}
        ${Components.statCard({
            label: 'Average Grade',
            value: avgGrade.toFixed(1) + '%',
            icon: '📈',
            trend: { type: 'up', text: '+2.5% from last term' },
            className: 'stat-card'
        })}
        ${Components.statCard({
            label: 'Attendance',
            value: '94%',
            icon: '✅',
            trend: { type: 'up', text: 'Excellent' },
            className: 'stat-card'
        })}
    `;
    
    document.getElementById('dashboardStats').innerHTML = statsHTML;
    
    // Load upcoming deadlines
    const upcomingHTML = `
        <h3 style="color: #333; margin-bottom: 15px;">📅 Upcoming Deadlines</h3>
        <div class="dashboard-grid">
            ${assignments.filter(a => a.status === 'Pending').map(assignment => 
                Components.card({
                    title: assignment.title,
                    icon: '📝',
                    content: `
                        <p><strong>Course:</strong> ${assignment.courseId}</p>
                        <p><strong>Due Date:</strong> ${assignment.dueDate}</p>
                        <p style="margin-top: 10px;">${assignment.description}</p>
                    `,
                    footer: `<span class="badge badge-warning">Due Soon</span>`
                })
            ).join('')}
        </div>
    `;
    
    document.getElementById('upcomingDeadlines').innerHTML = upcomingHTML;
}

/**
 * Load courses in Moodle-style layout
 */
async function loadCourses() {
    const courses = await API.courses.getAll();
    
    const coursesHTML = courses.map(course => 
        Components.card({
            title: course.name,
            icon: '📖',
            content: `
                <div style="margin-bottom: 15px;">
                    <p><strong>Course Code:</strong> ${course.id}</p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Credits:</strong> ${course.credits}</p>
                    <p><strong>Schedule:</strong> ${course.schedule}</p>
                </div>
                <div class="course-resources">
                    <h4 style="color: #667eea; margin-bottom: 10px;">📂 Course Resources</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                            <a href="#" style="color: #667eea; text-decoration: none;">📄 Lecture Notes - Week 1-5</a>
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                            <a href="#" style="color: #667eea; text-decoration: none;">🎥 Recorded Lectures</a>
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                            <a href="#" style="color: #667eea; text-decoration: none;">📚 Reading Materials</a>
                        </li>
                        <li style="padding: 8px 0;">
                            <a href="#" style="color: #667eea; text-decoration: none;">💬 Discussion Forum</a>
                        </li>
                    </ul>
                </div>
            `,
            footer: `
                <button class="btn btn-primary btn-sm" onclick="alert('Course materials will be available here')">
                    View Course Content
                </button>
            `,
            className: 'course-card'
        })
    ).join('');
    
    document.getElementById('coursesList').innerHTML = `
        <div class="dashboard-grid">
            ${coursesHTML}
        </div>
    `;
}

/**
 * Load timetable
 */
async function loadTimetable() {
    const timetable = await API.timetable.get();
    const timetableHTML = Components.timetable(timetable);
    document.getElementById('timetableContainer').innerHTML = timetableHTML;
}

/**
 * Load assignments
 */
async function loadAssignments() {
    const assignments = await API.assignments.getAll();
    const courses = await API.courses.getAll();
    
    const headers = ['Assignment', 'Course', 'Due Date', 'Status', 'Description'];
    const rows = assignments.map(assignment => {
        const course = courses.find(c => c.id === assignment.courseId);
        return [
            assignment.title,
            course ? course.name : assignment.courseId,
            assignment.dueDate,
            Components.badge({ 
                text: assignment.status, 
                type: assignment.status === 'Submitted' ? 'success' : 'warning' 
            }),
            assignment.description
        ];
    });
    
    const tableHTML = Components.table({
        headers,
        rows,
        className: 'data-table'
    });
    
    document.getElementById('assignmentsContainer').innerHTML = tableHTML;
}

/**
 * Load grades
 */
async function loadGrades() {
    const grades = await API.grades.getAll();
    const courses = await API.courses.getAll();
    
    const headers = ['Course', 'Assignment', 'Grade', 'Percentage', 'Status'];
    const rows = grades.map(grade => {
        const course = courses.find(c => c.id === grade.courseId);
        return [
            course ? course.name : grade.courseId,
            grade.assignment,
            grade.grade,
            grade.percentage + '%',
            Components.badge({ 
                text: grade.percentage >= 70 ? 'Excellent' : grade.percentage >= 60 ? 'Good' : 'Pass',
                type: grade.percentage >= 70 ? 'success' : grade.percentage >= 60 ? 'info' : 'warning'
            })
        ];
    });
    
    const tableHTML = Components.table({
        headers,
        rows,
        className: 'data-table'
    });
    
    // Calculate overall performance
    const avgPercentage = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
    
    const performanceHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin-bottom: 15px;">📊 Overall Performance</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Average Grade</div>
                    <div style="font-size: 2em; font-weight: 700;">${avgPercentage.toFixed(1)}%</div>
                </div>
                <div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Total Assessments</div>
                    <div style="font-size: 2em; font-weight: 700;">${grades.length}</div>
                </div>
                <div>
                    <div style="font-size: 0.9em; opacity: 0.9;">Classification</div>
                    <div style="font-size: 2em; font-weight: 700;">
                        ${avgPercentage >= 70 ? 'First Class' : avgPercentage >= 60 ? 'Upper Second' : avgPercentage >= 50 ? 'Lower Second' : 'Pass'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('gradesContainer').innerHTML = performanceHTML + tableHTML;
}
