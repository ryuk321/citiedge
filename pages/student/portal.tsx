"use client";

import { useEffect, useState } from 'react';
import { useProtectedRoute, logout } from '../../lib/auth';
import {
  fetchStudentProfile,
  fetchTuitionFees,
  fetchNotifications,
  fetchClasses,
  fetchMoodlePages,
  fetchAttendance,
  fetchGrades,
  fetchUpcomingAssignments,
  type Student,
  type TuitionFee,
  type Notification,
  type Class,
  type MoodlePage,
  type AttendanceRecord,
  type Grade,
  type Assignment
} from '../../lib/studentData';
import StudentClasses from './classes/classes';

export default function StudentDashboard() {
  // Protect this page - only students can access
  useProtectedRoute(['student']);
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [tuitionFees, setTuitionFees] = useState<TuitionFee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [moodlePages, setMoodlePages] = useState<MoodlePage[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      // Simulate fetching from database
      const studentId = "STD-2024-001"; // In real app, get from auth

      const [
        profileData,
        tuitionData,
        notificationsData,
        classesData,
        moodleData,
        attendanceData,
        gradesData,
        assignmentsData
      ] = await Promise.all([
        fetchStudentProfile(studentId),
        fetchTuitionFees(studentId),
        fetchNotifications(studentId),
        fetchClasses(studentId),
        fetchMoodlePages(studentId),
        fetchAttendance(studentId),
        fetchGrades(studentId),
        fetchUpcomingAssignments(studentId)
      ]);

      setStudent(profileData);
      setTuitionFees(tuitionData);
      setNotifications(notificationsData);
      setClasses(classesData);
      setMoodlePages(moodleData);
      setAttendance(attendanceData);
      setGrades(gradesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const averageGrade = grades.reduce((sum, g) => sum + g.overall, 0) / grades.length;
  const averageAttendance = attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12  rounded-lg flex items-center justify-center">
  <img 
    src="/citiedge-logo.jpg" 
    alt="Company Logo" 
    className="w-8 h-8 object-contain"
  />  
</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CITIEDGE</h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                <p className="text-xs text-gray-500">{student?.studentId}</p>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all">
                  <span className="text-white font-semibold">{student?.name.charAt(0)}</span>
                </button>
                {/* Logout Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'classes', label: 'Classes' },
              { id: 'moodle', label: 'Moodle' },
              { id: 'grades', label: 'Grades' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'tuition', label: 'Tuition' },
              { id: 'payments', label: 'Payments' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Grade</p>
                    <p className="text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{averageAttendance.toFixed(0)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingAssignments}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Enrolled Classes</p>
                    <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications & Assignments Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Notifications */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {notifications.slice(0, 5).map(notification => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                          notification.type === 'urgent' ? 'bg-red-500' :
                          notification.type === 'warning' ? 'bg-orange-500' :
                          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Assignments */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-xs text-gray-500">{assignment.className}</p>
                          <p className="text-xs text-gray-400 mt-1">Due: {assignment.dueDate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <StudentClasses studentId="STD-2024-001" />
        )}

        {/* Moodle Tab */}
        {activeTab === 'moodle' && (
          <div className="grid md:grid-cols-2 gap-6">
            {moodlePages.map(moodle => (
              <div key={moodle.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{moodle.className}</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Open Moodle
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Course Progress</span>
                      <span className="font-medium">{moodle.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${moodle.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{moodle.assignments}</p>
                      <p className="text-xs text-gray-600">Assignments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{moodle.announcements}</p>
                      <p className="text-xs text-gray-600">Announcements</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Last Accessed</p>
                      <p className="text-sm font-medium">{moodle.lastAccessed}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Midterm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map(grade => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grade.className}</div>
                          <div className="text-sm text-gray-500">{grade.classCode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.midterm}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.final > 0 ? `${grade.final}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.assignments}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.overall}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          grade.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="grid md:grid-cols-2 gap-6">
            {attendance.map(record => (
              <div key={record.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{record.className}</h3>
                    <p className="text-sm text-gray-600">{record.classCode}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    record.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    record.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    record.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Attendance Rate</span>
                      <span className="font-medium">{record.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          record.percentage >= 90 ? 'bg-green-600' :
                          record.percentage >= 80 ? 'bg-blue-600' :
                          record.percentage >= 70 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${record.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Classes Attended</p>
                      <p className="text-2xl font-bold text-green-600">{record.attended}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Classes</p>
                      <p className="text-2xl font-bold text-gray-900">{record.totalClasses}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tuition Tab */}
        {activeTab === 'tuition' && (
          <div className="space-y-6">
            {tuitionFees.map(fee => (
              <div key={fee.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className={`h-2 ${
                  fee.status === 'paid' ? 'bg-green-600' :
                  fee.status === 'pending' ? 'bg-orange-600' : 'bg-red-600'
                }`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{fee.semester}</h3>
                      <p className="text-sm text-gray-600">Due Date: {fee.dueDate}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                      fee.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fee.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border-r pr-6">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${fee.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="border-r pr-6">
                      <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                      <p className="text-2xl font-bold text-green-600">${fee.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Due Amount</p>
                      <p className="text-2xl font-bold text-orange-600">${fee.dueAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {fee.dueAmount > 0 && (
                    <div className="mt-6">
                      <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Make Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-700">
                Make secure payments for tuition, fees, and other charges using Stripe. All transactions are encrypted and protected.
              </p>
            </div>
            <iframe 
              src="/student/payments" 
              className="w-full h-[800px] border-0 rounded-lg shadow"
              title="Student Payments"
            />
          </div>
        )}
      </main>
    </div>
  );
}
