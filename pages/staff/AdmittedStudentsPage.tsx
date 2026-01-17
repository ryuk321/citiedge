import React, { useState, useEffect } from "react";
import { studentsAPI } from "../../lib/api";
import { StudentInfo } from "../../lib/DB_Table";
import { useStaffPermissions } from "../../components/staff/PermissionWrapper";
import { getAuthUser } from "../../lib/auth";

interface Student {
  id: string;
  students_number?: string;
  name: string;
  email: string;
  course: string;
  status: string;
  enrollment_date?: string;
  intake?: string;
  phone?: string;
  nationality?: string;
}

interface AdmittedStudentsPageProps {
  staffId: string;
  staffName: string;
}

const AdmittedStudentsPage: React.FC<AdmittedStudentsPageProps> = ({ staffId, staffName }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Permission check
  const { canView, canEdit, canDelete, loading: permissionsLoading } = useStaffPermissions(staffId);

  // Form state for editing
  const [formData, setFormData] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    address: "",
    nationality: "",
    course_id: "",
    enrollment_date: "",
    intake: "",
    status: "active",
  });

  useEffect(() => {
    if (!permissionsLoading && canView('admitted_students')) {
      loadStudents();
    }
  }, [permissionsLoading]);

  // Fetch students data
  const loadStudents = async () => {
    setLoading(true);
    const res = await studentsAPI.getAll();

    if (res.success) {
      const mapped = res.data.data.map((s: any) => ({
        id: String(s.id),
        name: `${s.first_name} ${s.last_name}`,
        students_number: s.student_number,
        email: s.email,
        course: String(s.course_id),
        status: s.status,
        enrollment_date: s.enrollment_date,
        intake: s.intake,
        phone: s.phone,
        nationality: s.nationality,
      }));
      setStudents(mapped);
    } else {
      setStudents([]);
    }

    setLoading(false);
  };

  // Log activity
  const logActivity = async (
    action: 'create' | 'update' | 'delete' | 'view',
    targetId: string,
    targetName: string,
    changes?: any
  ) => {
    try {
      await fetch('/api/staff/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: staffId,
          staff_name: staffName,
          action,
          target_type: 'student',
          target_id: targetId,
          target_name: targetName,
          changes
        })
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Open edit modal
  const handleEdit = async (student: Student) => {
    if (!canEdit('admitted_students')) {
      alert('You do not have permission to edit students');
      return;
    }

    setSelectedStudent(student);
    
    const nameParts = student.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData({
      student_number: student.students_number || '',
      first_name: firstName,
      last_name: lastName,
      email: student.email,
      phone: student.phone || '',
      dob: '',
      age: '',
      gender: '',
      address: '',
      nationality: student.nationality || '',
      course_id: student.course,
      enrollment_date: student.enrollment_date || '',
      intake: student.intake || '',
      status: student.status,
    });
    
    setShowEditModal(true);

    // Log view action
    await logActivity('view', student.id, student.name);
  };

  // Update student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !canEdit('admitted_students')) {
      alert('You do not have permission to edit students');
      return;
    }

    try {
      const result = await studentsAPI.update(selectedStudent.id, formData);

      if (result.success) {
        // Log update activity
        await logActivity('update', selectedStudent.id, selectedStudent.name, formData);

        loadStudents();
        setShowEditModal(false);
        setSelectedStudent(null);
        setFormData({
          student_number: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          dob: "",
          age: "",
          gender: "",
          address: "",
          nationality: "",
          course_id: "",
          enrollment_date: "",
          intake: "",
          status: "active",
        });
      } else {
        console.error("Failed to update student:", result.error);
        alert("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }
  };

  // Check permissions
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canView('admitted_students')) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-700">You do not have permission to view admitted students.</p>
        <p className="text-sm text-red-600 mt-2">Please contact your administrator to request access.</p>
      </div>
    );
  }

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.students_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admitted Students</h2>
        <p className="text-blue-100">View and manage enrolled students</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md w-full">
          <input
            type="text"
            placeholder="Search by name, email, or student number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <button
            onClick={loadStudents}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {filteredStudents.filter(s => s.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Graduated</div>
          <div className="text-2xl font-bold text-purple-600">
            {filteredStudents.filter(s => s.status === 'graduated').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-600">Inactive</div>
          <div className="text-2xl font-bold text-orange-600">
            {filteredStudents.filter(s => s.status === 'inactive').length}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-lg">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Student Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.students_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${student.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${student.status === 'inactive' ? 'bg-orange-100 text-orange-800' : ''}
                        ${student.status === 'graduated' ? 'bg-purple-100 text-purple-800' : ''}
                        ${student.status === 'withdrawn' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {canEdit('admitted_students') && (
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View/Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intake
                  </label>
                  <input
                    type="text"
                    value={formData.intake}
                    onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All changes will be logged with your staff ID: {staffId}
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmittedStudentsPage;
