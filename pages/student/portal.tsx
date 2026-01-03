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
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Load Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
                      <button 
                        onClick={() => setActiveTab('payments')}
                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Pay Now - ${fee.dueAmount.toLocaleString()}
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
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-blue-700">
                  Make secure payments for tuition, fees, and other charges using Stripe. All transactions are encrypted and protected.
                </p>
              </div>
            </div>
            
            {/* Stripe Payment Form */}
            <Elements stripe={stripePromise}>
              <PaymentFormIntegrated studentInfo={student} onPaymentSuccess={loadStudentData} />
            </Elements>

            {/* Payment History */}
            <PaymentHistoryIntegrated studentId={student?.studentId} />
          </div>
        )}
      </main>
    </div>
  );
}

// ========================================
// INTEGRATED PAYMENT FORM COMPONENT
// ========================================
interface PaymentFormProps {
  studentInfo: Student | null;
  onPaymentSuccess: () => void;
}

function PaymentFormIntegrated({ studentInfo, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Tuition Fee');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      return;
    }

    if (!stripe || !elements) {
      setMessage('Stripe is not loaded. Please refresh the page.');
      setMessageType('error');
      return;
    }

    if (!studentInfo) {
      setMessage('Student information not found.');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      // Step 1: Create PaymentIntent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'GBP',
          studentId: studentInfo.studentId,
          studentName: studentInfo.name,
          studentEmail: studentInfo.email,
          paymentType,
          description,
        }),
      });

      const { clientSecret, paymentIntentId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Step 2: Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: studentInfo.name,
            email: studentInfo.email,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Step 3: Save payment to database
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, saving to database...', {
          studentId: studentInfo.studentId,
          paymentIntentId: paymentIntent.id,
          amount: parseFloat(amount)
        });

        const saveResponse = await fetch('/api/stripe/save-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: studentInfo.studentId,
            studentName: studentInfo.name,
            studentEmail: studentInfo.email,
            paymentType,
            amount: parseFloat(amount),
            currency: 'GBP',
            stripePaymentIntentId: paymentIntent.id,
            stripeChargeId: (paymentIntent as any).latest_charge || null,
            paymentStatus: 'succeeded',
            description,
            receiptUrl: null,
          }),
        });

        const saveResult = await saveResponse.json();
        console.log('Save payment result:', saveResult);

        if (!saveResponse.ok || !saveResult.success) {
          console.error('Failed to save payment to database:', saveResult);
          setMessage(`Payment succeeded but failed to save to records. Payment ID: ${paymentIntent.id}. Please contact support.`);
          setMessageType('error');
          return;
        }

        setMessage(`Payment successful! Amount: £${amount}. Your tuition balance has been updated.`);
        setMessageType('success');
        
        // Reset form
        setAmount('');
        setDescription('');
        cardElement.clear();
        
        // Reload dashboard data
        onPaymentSuccess();
        window.dispatchEvent(new Event('paymentSuccess'));
      }
    } catch (error: any) {
      setMessage(error.message || 'Payment failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Secure Payment
            </h2>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-semibold">SSL Encrypted</span>
            </div>
          </div>
          <p className="text-blue-100 text-lg">Complete your payment securely using Stripe</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-100 text-sm">PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-100 text-sm">Verified by Stripe</span>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Payment Type <span className="text-red-500">*</span>
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="Tuition Fee">Tuition Fee</option>
            <option value="Registration Fee">Registration Fee</option>
            <option value="Exam Fee">Exam Fee</option>
            <option value="Library Fine">Library Fine</option>
            <option value="Lab Fee">Lab Fee</option>
            <option value="Other Fee">Other Fee</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Amount (£) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">£</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any additional notes about this payment..."
            rows={3}
            className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-bold text-gray-900">
              Card Details <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-6" />
              <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-6" />
              <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-6" />
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-inner focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 flex items-start space-x-2 text-sm">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-gray-600">
              <p className="font-semibold text-gray-900">Your payment is secured by Stripe</p>
              <p className="text-xs mt-1">256-bit SSL encryption • PCI DSS compliant • Your card details are never stored on our servers</p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-start ${
              messageType === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <svg 
              className={`w-5 h-5 mr-3 flex-shrink-0 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {messageType === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-5 px-8 rounded-xl font-bold text-white text-lg transition-all transform relative overflow-hidden ${
              isProcessing || !stripe
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            <span className={`flex items-center justify-center ${isProcessing ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay £{amount || '0.00'} Securely
            </span>
            {isProcessing && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-lg font-semibold">Processing Payment...</span>
              </span>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            By completing this payment, you agree to our terms and conditions
          </p>
        </div>
      </form>
    </div>
  );
}

// ========================================
// INTEGRATED PAYMENT HISTORY COMPONENT
// ========================================
interface PaymentHistoryProps {
  studentId: string | undefined;
}

function PaymentHistoryIntegrated({ studentId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPayments = async () => {
    if (!studentId) return;
    
    try {
      const response = await fetch(`/api/stripe/payment-history?studentId=${studentId}`);
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    window.addEventListener('paymentSuccess', loadPayments);
    return () => window.removeEventListener('paymentSuccess', loadPayments);
  }, [studentId]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Payment History
        </h2>
        <p className="text-gray-300 mt-1">View all your previous transactions</p>
      </div>
      
      <div className="p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading payment history...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No payments yet</h3>
            <p className="text-gray-600">Your payment history will appear here once you make your first payment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(payment.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.payment_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      £{parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.payment_status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : payment.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.payment_status === 'succeeded' ? 'Completed' : payment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.receipt_url ? (
                        <a
                          href={payment.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
