// Staff data models and fetching functions

export type StaffRole = 'admin' | 'lecturer' | 'office' | 'librarian' | 'counselor';

export interface Staff {
  id: string;
  name: string;
  email: string;
  staffId: string;
  role: StaffRole;
  department: string;
  phoneNumber?: string;
  avatar?: string;
  permissions: StaffPermissions;
}

export interface StaffPermissions {
  canManageStudents: boolean;
  canManageStaff: boolean;
  canManageCourses: boolean;
  canViewFinancials: boolean;
  canManageFinancials: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
  canManageLibrary: boolean;
  canCounselStudents: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: string;
  enrolledStudents: number;
  maxCapacity: number;
  schedule: string;
  room: string;
}

export interface LecturerClass extends Course {
  assignmentsToGrade: number;
  averageGrade: number;
  attendanceRate: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  status: 'active' | 'suspended' | 'graduated';
  enrolledCourses: number;
}

export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  date: string;
  read: boolean;
  from?: string;
}

export interface FinancialRecord {
  id: string;
  type: 'tuition' | 'expense' | 'salary' | 'other';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SystemReport {
  id: string;
  title: string;
  type: 'enrollment' | 'financial' | 'attendance' | 'grades' | 'other';
  generatedDate: string;
  generatedBy: string;
  fileUrl: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  type: 'book' | 'journal' | 'magazine' | 'digital';
  status: 'available' | 'borrowed' | 'reserved';
  borrowedBy?: string;
  dueDate?: string;
}

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  type: 'academic' | 'career' | 'personal' | 'general';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Role-based permission defaults
export const defaultPermissions: Record<StaffRole, StaffPermissions> = {
  admin: {
    canManageStudents: true,
    canManageStaff: true,
    canManageCourses: true,
    canViewFinancials: true,
    canManageFinancials: true,
    canViewReports: true,
    canManageSystem: true,
    canManageLibrary: true,
    canCounselStudents: true,
  },
  lecturer: {
    canManageStudents: false,
    canManageStaff: false,
    canManageCourses: true, // Only their courses
    canViewFinancials: false,
    canManageFinancials: false,
    canViewReports: true, // Only course-related reports
    canManageSystem: false,
    canManageLibrary: false,
    canCounselStudents: true, // Academic counseling
  },
  office: {
    canManageStudents: true, // Records management
    canManageStaff: false,
    canManageCourses: true, // Registration
    canViewFinancials: true,
    canManageFinancials: true,
    canViewReports: true,
    canManageSystem: false,
    canManageLibrary: false,
    canCounselStudents: false,
  },
  librarian: {
    canManageStudents: false,
    canManageStaff: false,
    canManageCourses: false,
    canViewFinancials: false,
    canManageFinancials: false,
    canViewReports: false,
    canManageSystem: false,
    canManageLibrary: true,
    canCounselStudents: false,
  },
  counselor: {
    canManageStudents: false,
    canManageStaff: false,
    canManageCourses: false,
    canViewFinancials: false,
    canManageFinancials: false,
    canViewReports: true, // Student-related reports
    canManageSystem: false,
    canManageLibrary: false,
    canCounselStudents: true,
  },
};

// Simulated data fetching functions
export const fetchStaffProfile = async (staffId: string): Promise<Staff> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: staffId,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    staffId: "STF-2024-001",
    role: "admin", // Change this to test different roles
    department: "Computer Science",
    phoneNumber: "+1 (555) 123-4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    permissions: defaultPermissions.admin,
  };
};

export const fetchLecturerClasses = async (staffId: string): Promise<LecturerClass[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      code: "CS101",
      name: "Introduction to Programming",
      department: "Computer Science",
      credits: 3,
      semester: "Fall 2024",
      enrolledStudents: 45,
      maxCapacity: 50,
      schedule: "Mon, Wed, Fri 9:00 AM - 10:00 AM",
      room: "Room 301",
      assignmentsToGrade: 12,
      averageGrade: 78.5,
      attendanceRate: 92,
    },
    {
      id: "2",
      code: "CS201",
      name: "Data Structures",
      department: "Computer Science",
      credits: 4,
      semester: "Fall 2024",
      enrolledStudents: 38,
      maxCapacity: 40,
      schedule: "Tue, Thu 2:00 PM - 4:00 PM",
      room: "Room 205",
      assignmentsToGrade: 8,
      averageGrade: 82.3,
      attendanceRate: 88,
    },
    {
      id: "3",
      code: "CS401",
      name: "Advanced Algorithms",
      department: "Computer Science",
      credits: 4,
      semester: "Fall 2024",
      enrolledStudents: 25,
      maxCapacity: 30,
      schedule: "Wed 6:00 PM - 9:00 PM",
      room: "Room 401",
      assignmentsToGrade: 5,
      averageGrade: 85.7,
      attendanceRate: 95,
    },
  ];
};

export const fetchStudentRecords = async (staffId: string): Promise<StudentRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      name: "John Doe",
      studentId: "STD-2024-001",
      email: "john.doe@university.edu",
      program: "Computer Science",
      year: 2,
      gpa: 3.7,
      status: "active",
      enrolledCourses: 5,
    },
    {
      id: "2",
      name: "Jane Smith",
      studentId: "STD-2024-002",
      email: "jane.smith@university.edu",
      program: "Business Administration",
      year: 3,
      gpa: 3.9,
      status: "active",
      enrolledCourses: 4,
    },
    {
      id: "3",
      name: "Mike Johnson",
      studentId: "STD-2024-003",
      email: "mike.j@university.edu",
      program: "Engineering",
      year: 1,
      gpa: 3.5,
      status: "active",
      enrolledCourses: 6,
    },
  ];
};

export const fetchStaffNotifications = async (staffId: string): Promise<StaffNotification[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      title: "New Student Enrollment",
      message: "5 new students have been enrolled in CS101",
      type: "info",
      date: new Date().toISOString(),
      read: false,
      from: "Admissions Office",
    },
    {
      id: "2",
      title: "Grades Due",
      message: "Final grades for CS201 are due by December 20th",
      type: "warning",
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false,
      from: "Academic Office",
    },
    {
      id: "3",
      title: "Faculty Meeting",
      message: "Department meeting scheduled for tomorrow at 3 PM",
      type: "info",
      date: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      from: "Department Head",
    },
  ];
};

export const fetchFinancialRecords = async (staffId: string): Promise<FinancialRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      type: "tuition",
      amount: 45000,
      date: "2024-12-01",
      description: "Fall 2024 Tuition Collection",
      status: "completed",
    },
    {
      id: "2",
      type: "expense",
      amount: 12000,
      date: "2024-12-05",
      description: "Lab Equipment Purchase",
      status: "completed",
    },
    {
      id: "3",
      type: "salary",
      amount: 85000,
      date: "2024-12-10",
      description: "Staff Salary - December 2024",
      status: "pending",
    },
  ];
};

export const fetchSystemReports = async (staffId: string): Promise<SystemReport[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      title: "Fall 2024 Enrollment Report",
      type: "enrollment",
      generatedDate: "2024-12-01",
      generatedBy: "System",
      fileUrl: "/reports/enrollment-fall-2024.pdf",
    },
    {
      id: "2",
      title: "Q4 2024 Financial Summary",
      type: "financial",
      generatedDate: "2024-12-10",
      generatedBy: "Finance Department",
      fileUrl: "/reports/financial-q4-2024.pdf",
    },
  ];
};

export const fetchLibraryItems = async (staffId: string): Promise<LibraryItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      title: "Introduction to Algorithms",
      author: "Cormen et al.",
      isbn: "978-0262033848",
      type: "book",
      status: "available",
    },
    {
      id: "2",
      title: "Clean Code",
      author: "Robert Martin",
      isbn: "978-0132350884",
      type: "book",
      status: "borrowed",
      borrowedBy: "STD-2024-001",
      dueDate: "2024-12-20",
    },
  ];
};

export const fetchCounselingSessions = async (staffId: string): Promise<CounselingSession[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      studentId: "STD-2024-001",
      studentName: "John Doe",
      date: "2024-12-15",
      time: "10:00 AM",
      type: "academic",
      status: "scheduled",
    },
    {
      id: "2",
      studentId: "STD-2024-002",
      studentName: "Jane Smith",
      date: "2024-12-13",
      time: "2:00 PM",
      type: "career",
      status: "completed",
      notes: "Discussed internship opportunities",
    },
  ];
};
