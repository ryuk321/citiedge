/**
 * API Layer - Handles all data operations
 * In production, these would be actual HTTP requests to a backend server
 */

// Mock database
let mockDatabase = {
    students: [
        {
            id: 'S001',
            name: 'John Smith',
            email: 'john.smith@citiedge.ac.uk',
            program: 'Computer Science',
            year: 2,
            enrollmentDate: '2023-09-01',
            status: 'Active'
        },
        {
            id: 'S002',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@citiedge.ac.uk',
            program: 'Business Administration',
            year: 3,
            enrollmentDate: '2022-09-01',
            status: 'Active'
        },
        {
            id: 'S003',
            name: 'Michael Chen',
            email: 'michael.chen@citiedge.ac.uk',
            program: 'Engineering',
            year: 1,
            enrollmentDate: '2024-09-01',
            status: 'Active'
        }
    ],
    courses: [
        {
            id: 'CS101',
            name: 'Computer Science 101',
            instructor: 'Dr. Amanda Wilson',
            credits: 4,
            schedule: 'Mon/Wed 10:00-11:30'
        },
        {
            id: 'MATH201',
            name: 'Mathematics 201',
            instructor: 'Prof. Robert Martinez',
            credits: 3,
            schedule: 'Tue/Thu 14:00-15:30'
        },
        {
            id: 'DS301',
            name: 'Data Structures 301',
            instructor: 'Dr. Lisa Anderson',
            credits: 4,
            schedule: 'Mon/Wed 13:00-14:30'
        },
        {
            id: 'WEB202',
            name: 'Web Development 202',
            instructor: 'Prof. James Taylor',
            credits: 3,
            schedule: 'Tue/Thu 10:00-11:30'
        }
    ],
    timetable: [
        {
            day: 'Monday',
            slots: [
                { time: '09:00-10:00', course: 'CS101', location: 'Room A101', type: 'Lecture' },
                { time: '11:00-12:00', course: 'DS301', location: 'Room B205', type: 'Lab' },
                { time: '14:00-15:00', course: null, location: null, type: 'Free' }
            ]
        },
        {
            day: 'Tuesday',
            slots: [
                { time: '09:00-10:00', course: 'WEB202', location: 'Room C301', type: 'Lecture' },
                { time: '11:00-12:00', course: 'MATH201', location: 'Room A102', type: 'Tutorial' },
                { time: '14:00-15:00', course: 'MATH201', location: 'Room A102', type: 'Lecture' }
            ]
        },
        {
            day: 'Wednesday',
            slots: [
                { time: '09:00-10:00', course: 'CS101', location: 'Room A101', type: 'Lecture' },
                { time: '11:00-12:00', course: 'DS301', location: 'Lab 3', type: 'Practical' },
                { time: '14:00-15:00', course: null, location: null, type: 'Free' }
            ]
        },
        {
            day: 'Thursday',
            slots: [
                { time: '09:00-10:00', course: 'WEB202', location: 'Room C301', type: 'Lab' },
                { time: '11:00-12:00', course: null, location: null, type: 'Free' },
                { time: '14:00-15:00', course: 'MATH201', location: 'Room A102', type: 'Lecture' }
            ]
        },
        {
            day: 'Friday',
            slots: [
                { time: '09:00-10:00', course: null, location: null, type: 'Free' },
                { time: '11:00-12:00', course: 'CS101', location: 'Lab 1', type: 'Tutorial' },
                { time: '14:00-15:00', course: null, location: null, type: 'Free' }
            ]
        }
    ],
    assignments: [
        {
            id: 'A001',
            courseId: 'CS101',
            title: 'Final Project',
            dueDate: '2024-12-15',
            status: 'Pending',
            description: 'Build a full-stack web application'
        },
        {
            id: 'A002',
            courseId: 'MATH201',
            title: 'Research Paper',
            dueDate: '2024-12-18',
            status: 'Pending',
            description: 'Write a research paper on calculus applications'
        },
        {
            id: 'A003',
            courseId: 'DS301',
            title: 'Lab Assignment',
            dueDate: '2024-12-12',
            status: 'Submitted',
            description: 'Implement binary search tree'
        }
    ],
    grades: [
        { courseId: 'CS101', assignment: 'Assignment 1', grade: 'A', percentage: 95 },
        { courseId: 'MATH201', assignment: 'Midterm', grade: 'B+', percentage: 87 },
        { courseId: 'WEB202', assignment: 'Project', grade: 'A-', percentage: 92 },
        { courseId: 'DS301', assignment: 'Quiz 3', grade: 'A', percentage: 98 }
    ]
};

// API Methods
const API = {
    // Student Management
    students: {
        getAll: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockDatabase.students]), 100);
            });
        },
        
        getById: async (id) => {
            return new Promise((resolve) => {
                const student = mockDatabase.students.find(s => s.id === id);
                setTimeout(() => resolve(student), 100);
            });
        },
        
        create: async (studentData) => {
            return new Promise((resolve) => {
                const newStudent = {
                    id: 'S' + String(mockDatabase.students.length + 1).padStart(3, '0'),
                    ...studentData,
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    status: 'Active'
                };
                mockDatabase.students.push(newStudent);
                setTimeout(() => resolve(newStudent), 100);
            });
        },
        
        update: async (id, studentData) => {
            return new Promise((resolve) => {
                const index = mockDatabase.students.findIndex(s => s.id === id);
                if (index !== -1) {
                    mockDatabase.students[index] = { ...mockDatabase.students[index], ...studentData };
                    setTimeout(() => resolve(mockDatabase.students[index]), 100);
                } else {
                    setTimeout(() => resolve(null), 100);
                }
            });
        },
        
        delete: async (id) => {
            return new Promise((resolve) => {
                const index = mockDatabase.students.findIndex(s => s.id === id);
                if (index !== -1) {
                    mockDatabase.students.splice(index, 1);
                    setTimeout(() => resolve(true), 100);
                } else {
                    setTimeout(() => resolve(false), 100);
                }
            });
        }
    },
    
    // Course Management
    courses: {
        getAll: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockDatabase.courses]), 100);
            });
        },
        
        getById: async (id) => {
            return new Promise((resolve) => {
                const course = mockDatabase.courses.find(c => c.id === id);
                setTimeout(() => resolve(course), 100);
            });
        }
    },
    
    // Timetable
    timetable: {
        get: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockDatabase.timetable]), 100);
            });
        }
    },
    
    // Assignments
    assignments: {
        getAll: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockDatabase.assignments]), 100);
            });
        },
        
        getByCourse: async (courseId) => {
            return new Promise((resolve) => {
                const assignments = mockDatabase.assignments.filter(a => a.courseId === courseId);
                setTimeout(() => resolve(assignments), 100);
            });
        }
    },
    
    // Grades
    grades: {
        getAll: async () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockDatabase.grades]), 100);
            });
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
