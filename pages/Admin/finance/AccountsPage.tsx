import React, { useState, useEffect } from 'react';
import { StudentInfo } from '../../../lib/DB_Table';

interface TuitionFee {
  id?: number;
  student_id: string;
  academic_year: string;
  semester: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  created_at?: string;
  updated_at?: string;
}

interface StudentWithFinance extends StudentInfo {
  tuition_fees?: TuitionFee[];
  total_outstanding?: number;
}

const AccountsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentWithFinance[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFinance | null>(null);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<TuitionFee | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [newFee, setNewFee] = useState<Partial<TuitionFee>>({
    academic_year: '',
    semester: '',
    total_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    due_date: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchStudentsWithFinances();
  }, []);

  const fetchStudentsWithFinances = async () => {
    try {
      setLoading(true);
      // Fetch all students
      const studentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=getStudents`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
          },
        }
      );
      const studentsData = await studentsRes.json();

      if (studentsData.success) {
        // Fetch tuition fees for all students
        const studentsWithFees = await Promise.all(
          studentsData.data.map(async (student: StudentInfo) => {
            const feesRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=getStudentTuitionFees&student_id=${student.student_number}`,
              {
                headers: {
                  'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
                },
              }
            );
            const feesData = await feesRes.json();
            const fees = feesData.success ? feesData.fees : [];
            const total_outstanding = fees.reduce(
              (sum: number, fee: TuitionFee) => sum + fee.due_amount,
              0
            );

            return {
              ...student,
              tuition_fees: fees,
              total_outstanding,
            };
          })
        );

        setStudents(studentsWithFees);
      }
    } catch (error) {
      console.error('Error fetching students with finances:', error);
      alert('Error loading student financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTuitionFee = async () => {
    if (!selectedStudent) return;

    try {
      const feeData = {
        ...newFee,
        student_id: selectedStudent.student_number,
        due_amount: (newFee.total_amount || 0) - (newFee.paid_amount || 0),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=addTuitionFee`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
          },
          body: JSON.stringify(feeData),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Tuition fee added successfully!');
        setShowAddFeeModal(false);
        setNewFee({
          academic_year: '',
          semester: '',
          total_amount: 0,
          paid_amount: 0,
          due_amount: 0,
          due_date: '',
          status: 'pending',
        });
        fetchStudentsWithFinances();
      } else {
        alert('Error: ' + (data.error || 'Failed to add tuition fee'));
      }
    } catch (error) {
      console.error('Error adding tuition fee:', error);
      alert('Error adding tuition fee');
    }
  };

  const handleUpdateTuitionFee = async () => {
    if (!selectedFee) return;

    try {
      const updatedFee = {
        ...selectedFee,
        due_amount: selectedFee.total_amount - selectedFee.paid_amount,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=updateTuitionFee`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
          },
          body: JSON.stringify(updatedFee),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Tuition fee updated successfully!');
        setShowEditModal(false);
        setSelectedFee(null);
        fetchStudentsWithFinances();
      } else {
        alert('Error: ' + (data.error || 'Failed to update tuition fee'));
      }
    } catch (error) {
      console.error('Error updating tuition fee:', error);
      alert('Error updating tuition fee');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Accounts Management</h1>
            <p className="text-green-100">Manage student finances, tuition fees, and payment tracking</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
            <div className="text-white text-center">
              <p className="text-sm font-medium">Total Outstanding</p>
              <p className="text-3xl font-bold">
                £{Number(students.reduce((sum, s) => sum + (Number(s.total_outstanding) || 0), 0) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, student number, or email..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-blue-900">{students.length}</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Outstanding Fees</p>
            <p className="text-2xl font-bold text-red-900">
              {students.filter((s) => (s.total_outstanding || 0) > 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">Student Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Course ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Total Outstanding</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {student.student_number}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.course_id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                        (student.total_outstanding || 0) > 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      £{Number(student.total_outstanding || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && !showAddFeeModal && !showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {selectedStudent.student_number} • {selectedStudent.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <p className="text-sm text-blue-600 font-medium mb-2">Total Fees</p>
                  <p className="text-3xl font-bold text-blue-900">
                    £
                    {Number((selectedStudent.tuition_fees || [])
                      .reduce((sum, fee) => sum + fee.total_amount, 0) || 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <p className="text-sm text-green-600 font-medium mb-2">Total Paid</p>
                  <p className="text-3xl font-bold text-green-900">
                    £
                    {Number((selectedStudent.tuition_fees || [])
                      .reduce((sum, fee) => sum + fee.paid_amount, 0) || 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <p className="text-sm text-red-600 font-medium mb-2">Outstanding</p>
                  <p className="text-3xl font-bold text-red-900">
                    £{Number(selectedStudent.total_outstanding || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Add Fee Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tuition Fee Records</h3>
                <button
                  onClick={() => setShowAddFeeModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Tuition Fee
                </button>
              </div>

              {/* Tuition Fees Table */}
              {selectedStudent.tuition_fees && selectedStudent.tuition_fees.length > 0 ? (
                <div className="overflow-x-auto border-2 border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Academic Year
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Semester
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Total Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Paid Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Due Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedStudent.tuition_fees.map((fee) => (
                        <tr key={fee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{fee.academic_year}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{fee.semester}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            £{Number(fee.total_amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            £{Number(fee.paid_amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-red-600">
                            £{Number(fee.due_amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{fee.due_date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(
                                fee.status
                              )}`}
                            >
                              {fee.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedFee(fee);
                                setShowEditModal(true);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">No tuition fee records found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click "Add Tuition Fee" to create a new fee record
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Fee Modal */}
      {showAddFeeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">Add Tuition Fee</h2>
              <p className="text-green-100 text-sm mt-1">
                {selectedStudent.first_name} {selectedStudent.last_name} (
                {selectedStudent.student_number})
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Academic Year *</span>
                  <input
                    type="text"
                    value={newFee.academic_year}
                    onChange={(e) => setNewFee({ ...newFee, academic_year: e.target.value })}
                    placeholder="2025-2026"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Semester *</span>
                  <select
                    value={newFee.semester}
                    onChange={(e) => setNewFee({ ...newFee, semester: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Total Amount (£) *</span>
                  <input
                    type="number"
                    step="0.01"
                    value={newFee.total_amount}
                    onChange={(e) => {
                      const total = parseFloat(e.target.value) || 0;
                      const paid = newFee.paid_amount || 0;
                      setNewFee({
                        ...newFee,
                        total_amount: total,
                        due_amount: total - paid,
                      });
                    }}
                    placeholder="15000.00"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Paid Amount (£)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={newFee.paid_amount}
                    onChange={(e) => {
                      const paid = parseFloat(e.target.value) || 0;
                      const total = newFee.total_amount || 0;
                      setNewFee({
                        ...newFee,
                        paid_amount: paid,
                        due_amount: total - paid,
                      });
                    }}
                    placeholder="0.00"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Due Date *</span>
                  <input
                    type="date"
                    value={newFee.due_date}
                    onChange={(e) => setNewFee({ ...newFee, due_date: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Status</span>
                  <select
                    value={newFee.status}
                    onChange={(e) =>
                      setNewFee({
                        ...newFee,
                        status: e.target.value as 'pending' | 'partial' | 'paid' | 'overdue',
                      })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </label>

                <div className="md:col-span-2 bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">Summary:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        £{(newFee.total_amount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Paid Amount</p>
                      <p className="text-lg font-bold text-green-600">
                        £{(newFee.paid_amount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Due Amount</p>
                      <p className="text-lg font-bold text-red-600">
                        £{((newFee.total_amount || 0) - (newFee.paid_amount || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddFeeModal(false);
                    setNewFee({
                      academic_year: '',
                      semester: '',
                      total_amount: 0,
                      paid_amount: 0,
                      due_amount: 0,
                      due_date: '',
                      status: 'pending',
                    });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTuitionFee}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Add Tuition Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fee Modal */}
      {showEditModal && selectedFee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">Edit Tuition Fee</h2>
              <p className="text-blue-100 text-sm mt-1">
                {selectedFee.academic_year} - {selectedFee.semester}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Academic Year</span>
                  <input
                    type="text"
                    value={selectedFee.academic_year}
                    onChange={(e) =>
                      setSelectedFee({ ...selectedFee, academic_year: e.target.value })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Semester</span>
                  <input
                    type="text"
                    value={selectedFee.semester}
                    onChange={(e) => setSelectedFee({ ...selectedFee, semester: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Total Amount (£)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedFee.total_amount}
                    onChange={(e) => {
                      const total = parseFloat(e.target.value) || 0;
                      setSelectedFee({
                        ...selectedFee,
                        total_amount: total,
                        due_amount: total - selectedFee.paid_amount,
                      });
                    }}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Paid Amount (£)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedFee.paid_amount}
                    onChange={(e) => {
                      const paid = parseFloat(e.target.value) || 0;
                      setSelectedFee({
                        ...selectedFee,
                        paid_amount: paid,
                        due_amount: selectedFee.total_amount - paid,
                      });
                    }}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Due Date</span>
                  <input
                    type="date"
                    value={selectedFee.due_date}
                    onChange={(e) => setSelectedFee({ ...selectedFee, due_date: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Status</span>
                  <select
                    value={selectedFee.status}
                    onChange={(e) =>
                      setSelectedFee({
                        ...selectedFee,
                        status: e.target.value as 'pending' | 'partial' | 'paid' | 'overdue',
                      })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </label>

                <div className="md:col-span-2 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium mb-2">Updated Summary:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-blue-600">Total Amount</p>
                      <p className="text-lg font-bold text-blue-900">
                        £{Number(selectedFee.total_amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Paid Amount</p>
                      <p className="text-lg font-bold text-green-700">
                        £{Number(selectedFee.paid_amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600">Due Amount</p>
                      <p className="text-lg font-bold text-red-700">
                        £{(Number(selectedFee.total_amount) - Number(selectedFee.paid_amount)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFee(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTuitionFee}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
