// Simulating database models and fetching functions

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  year: number;
  avatar?: string;
}

export interface TuitionFee {
  id: string;
  semester: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  date: string;
  read: boolean;
}

export interface Class {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  room: string;
  credits: number;
  color: string;
}

export interface MoodlePage {
  id: string;
  classId: string;
  className: string;
  assignments: number;
  announcements: number;
  lastAccessed: string;
  progress: number;
}

export interface AttendanceRecord {
  id: string;
  classCode: string;
  className: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface Grade {
  id: string;
  classCode: string;
  className: string;
  midterm: number;
  final: number;
  assignments: number;
  overall: number;
  grade: string;
}

export interface Assignment {
  id: string;
  classCode: string;
  className: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

// Simulating database fetch functions

export async function fetchStudentProfile(studentId: string): Promise<Student> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: studentId,
    name: "John Doe",
    email: "john.doe@citiedge.edu",
    studentId: "STD-2024-001",
    program: "Computer Science",
    year: 3,
  };
}

export async function fetchTuitionFees(studentId: string): Promise<TuitionFee[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "1",
      semester: "Fall 2025",
      totalAmount: 15000,
      paidAmount: 15000,
      dueAmount: 0,
      dueDate: "2025-09-01",
      status: "paid"
    },
    {
      id: "2",
      semester: "Spring 2026",
      totalAmount: 15000,
      paidAmount: 5000,
      dueAmount: 10000,
      dueDate: "2026-01-15",
      status: "pending"
    }
  ];
}

export async function fetchNotifications(studentId: string): Promise<Notification[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: "1",
      title: "Assignment Due Tomorrow",
      message: "Your Data Structures assignment is due tomorrow at 11:59 PM",
      type: "warning",
      date: "2025-12-12",
      read: false
    },
    {
      id: "2",
      title: "Tuition Payment Reminder",
      message: "Spring 2026 tuition payment is due on January 15, 2026",
      type: "urgent",
      date: "2025-12-10",
      read: false
    },
    {
      id: "3",
      title: "Grade Posted",
      message: "Your grade for Database Systems midterm has been posted",
      type: "success",
      date: "2025-12-09",
      read: true
    },
    {
      id: "4",
      title: "Class Cancelled",
      message: "Web Development class on Dec 14 has been cancelled",
      type: "info",
      date: "2025-12-08",
      read: true
    }
  ];
}

export async function fetchClasses(studentId: string): Promise<Class[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: "1",
      code: "CS301",
      name: "Data Structures",
      instructor: "Dr. Sarah Johnson",
      schedule: "Mon, Wed 10:00 AM - 11:30 AM",
      room: "Room 305",
      credits: 3,
      color: "blue"
    },
    {
      id: "2",
      code: "CS302",
      name: "Database Systems",
      instructor: "Prof. Michael Chen",
      schedule: "Tue, Thu 2:00 PM - 3:30 PM",
      room: "Room 201",
      credits: 4,
      color: "indigo"
    },
    {
      id: "3",
      code: "CS303",
      name: "Web Development",
      instructor: "Dr. Emily Brown",
      schedule: "Mon, Wed 2:00 PM - 3:30 PM",
      room: "Lab 102",
      credits: 3,
      color: "purple"
    },
    {
      id: "4",
      code: "CS304",
      name: "Operating Systems",
      instructor: "Prof. David Martinez",
      schedule: "Tue, Thu 10:00 AM - 11:30 AM",
      room: "Room 403",
      credits: 3,
      color: "green"
    }
  ];
}

export async function fetchMoodlePages(studentId: string): Promise<MoodlePage[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return [
    {
      id: "1",
      classId: "1",
      className: "Data Structures",
      assignments: 3,
      announcements: 2,
      lastAccessed: "2025-12-12",
      progress: 75
    },
    {
      id: "2",
      classId: "2",
      className: "Database Systems",
      assignments: 2,
      announcements: 1,
      lastAccessed: "2025-12-11",
      progress: 85
    },
    {
      id: "3",
      classId: "3",
      className: "Web Development",
      assignments: 4,
      announcements: 3,
      lastAccessed: "2025-12-10",
      progress: 60
    },
    {
      id: "4",
      classId: "4",
      className: "Operating Systems",
      assignments: 1,
      announcements: 1,
      lastAccessed: "2025-12-09",
      progress: 90
    }
  ];
}

export async function fetchAttendance(studentId: string): Promise<AttendanceRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "1",
      classCode: "CS301",
      className: "Data Structures",
      totalClasses: 40,
      attended: 38,
      percentage: 95,
      status: "excellent"
    },
    {
      id: "2",
      classCode: "CS302",
      className: "Database Systems",
      totalClasses: 38,
      attended: 35,
      percentage: 92,
      status: "excellent"
    },
    {
      id: "3",
      classCode: "CS303",
      className: "Web Development",
      totalClasses: 42,
      attended: 34,
      percentage: 81,
      status: "good"
    },
    {
      id: "4",
      classCode: "CS304",
      className: "Operating Systems",
      totalClasses: 36,
      attended: 25,
      percentage: 69,
      status: "warning"
    }
  ];
}

export async function fetchGrades(studentId: string): Promise<Grade[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return [
    {
      id: "1",
      classCode: "CS301",
      className: "Data Structures",
      midterm: 88,
      final: 92,
      assignments: 95,
      overall: 91.5,
      grade: "A"
    },
    {
      id: "2",
      classCode: "CS302",
      className: "Database Systems",
      midterm: 85,
      final: 0,
      assignments: 90,
      overall: 87.5,
      grade: "B+"
    },
    {
      id: "3",
      classCode: "CS303",
      className: "Web Development",
      midterm: 78,
      final: 0,
      assignments: 85,
      overall: 81.5,
      grade: "B"
    },
    {
      id: "4",
      classCode: "CS304",
      className: "Operating Systems",
      midterm: 92,
      final: 0,
      assignments: 88,
      overall: 90,
      grade: "A-"
    }
  ];
}

export async function fetchUpcomingAssignments(studentId: string): Promise<Assignment[]> {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  return [
    {
      id: "1",
      classCode: "CS301",
      className: "Data Structures",
      title: "Binary Search Tree Implementation",
      dueDate: "2025-12-14",
      status: "pending"
    },
    {
      id: "2",
      classCode: "CS302",
      className: "Database Systems",
      title: "SQL Query Optimization Project",
      dueDate: "2025-12-18",
      status: "pending"
    },
    {
      id: "3",
      classCode: "CS303",
      className: "Web Development",
      title: "React Component Assignment",
      dueDate: "2025-12-12",
      status: "submitted"
    },
    {
      id: "4",
      classCode: "CS304",
      className: "Operating Systems",
      title: "Process Scheduling Algorithm",
      dueDate: "2025-12-20",
      status: "pending"
    }
  ];
}
