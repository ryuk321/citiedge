import React, { useState, useEffect } from "react";
import { studentsAPI } from "../../../lib/api";
import { StudentInfo } from "../../../lib/DB_Table";
import { logout, getAuthUser } from "../../../lib/auth";

interface Student {
  id: string;
  students_number?: string;
  name: string;
  email: string;
  course: string;
  status: string;
}

const StudentsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    student_number: "", // unique ID, can be auto-generated
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    address: "",
    nationality: "",
    course_id: "", // numeric ID from courses table
    enrollment_date: "", // YYYY-MM-DD
    intake: "", // e.g. "Fall 2025"
    status: "active",
  });

  // Fetch students data
  const loadStudents = async () => {
    setLoading(true);
    const res = await studentsAPI.getAll();

    const data = res.data;
    if (res.success) {
      const mapped = res.data.data.map((s: any) => ({
        id: String(s.id),
        name: `${s.first_name} ${s.last_name}`,
        students_number: s.student_number,
        email: s.email,
        course: String(s.course_id),
        status: s.status,
      }));
   
      setStudents(mapped);
  
    } else {
      setStudents([]); // fallback if response is invalid
    }

    setLoading(false);
  };

  // Add new student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await studentsAPI.add(formData);

      if (result.success) {
        // reload the student list
        loadStudents();

        // close the add form
        setShowAddForm(false);

        // reset all fields back to defaults
        setFormData({
          student_number: "", // unique ID, can be auto-generated
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          dob: "",
          age: "",
          gender: "",
          address: "",
          nationality: "",
          course_id: "", // numeric ID from courses table
          enrollment_date: "", // YYYY-MM-DD
          intake: "", // e.g. "Fall 2025"
          status: "active",
        });
      } else {
        console.error("Failed to add student:", result.error);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Delete student
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await studentsAPI.delete(id);
      loadStudents();
    }
  };

  // Open edit modal with student data
  const handleMore = async (student: Student) => {
    setSelectedStudent(student);
    
    // Pre-populate form with student data
    // Parse name back to first and last name
    const nameParts = student.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData({
      student_number: student.students_number || '',
      first_name: firstName,
      last_name: lastName,
      email: student.email,
      phone: '',
      dob: '',
      age: '',
      gender: '',
      address: '',
      nationality: '',
      course_id: student.course,
      enrollment_date: '',
      intake: '',
      status: student.status,
    });
    
    setShowEditModal(true);
  };

  // Update student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) return;

    try {
      const result = await studentsAPI.update(selectedStudent.id, formData);

      if (result.success) {
        loadStudents();
        setShowEditModal(false);
        setSelectedStudent(null);
        // Reset form
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
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Get current user after mount to avoid hydration error
  useEffect(() => {
    setCurrentUser(getAuthUser());
  }, []);

  // Load data on mount
  useEffect(() => {
    loadStudents();
  }, []);

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Student
          </button>
          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser?.username || currentUser?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
            </div>
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
                {currentUser?.username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
              </button>
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

      {/* Add Student Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Add New Student
          </h3>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Number */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">
                  Student Number
                </span>
                <input
                  type="text"
                  value={formData.student_number}
                  onChange={(e) =>
                    setFormData({ ...formData, student_number: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* First Name */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">First Name</span>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* Last Name */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Last Name</span>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* Email */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* Date of Birth */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">
                  Date of Birth
                </span>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* Age */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Age</span>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* Phone */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Phone Number</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* Gender */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Gender</span>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {/* Address */}
              <label className="flex flex-col md:col-span-2">
                <span className="text-sm text-gray-700 mb-1">Address</span>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  rows={2}
                />
              </label>

              {/* Nationality */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Nationality</span>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* Course ID */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Course ID</span>
                <input
                  type="text"
                  value={formData.course_id}
                  onChange={(e) =>
                    setFormData({ ...formData, course_id: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </label>

              {/* Enrollment Date */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">
                  Enrollment Date
                </span>
                <input
                  type="date"
                  value={formData.enrollment_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enrollment_date: e.target.value,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </label>

              {/* Intake */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Intake</span>
                <select
                  value={formData.intake}
                  onChange={(e) =>
                    setFormData({ ...formData, intake: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Intake</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Spring 2026">Spring 2026</option>
                </select>
              </label>

              {/* Status */}
              <label className="flex flex-col">
                <span className="text-sm text-gray-700 mb-1">Status</span>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Student
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
           
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.students_number}
                   
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.course}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleMore(student)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Student Details
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Number */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">
                    Student Number
                  </span>
                  <input
                    type="text"
                    value={formData.student_number}
                    onChange={(e) =>
                      setFormData({ ...formData, student_number: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </label>

                {/* First Name */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">First Name</span>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </label>

                {/* Last Name */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Last Name</span>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </label>

                {/* Email */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </label>

                {/* Date of Birth */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">
                    Date of Birth
                  </span>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </label>

                {/* Age */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Age</span>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </label>

                {/* Phone */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Phone Number</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </label>

                {/* Gender */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Gender</span>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                {/* Address */}
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-700 mb-1">Address</span>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    rows={2}
                  />
                </label>

                {/* Nationality */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Nationality</span>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </label>

                {/* Course ID */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Course ID</span>
                  <input
                    type="text"
                    value={formData.course_id}
                    onChange={(e) =>
                      setFormData({ ...formData, course_id: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </label>

                {/* Enrollment Date */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">
                    Enrollment Date
                  </span>
                  <input
                    type="date"
                    value={formData.enrollment_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enrollment_date: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </label>

                {/* Intake */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Intake</span>
                  <select
                    value={formData.intake}
                    onChange={(e) =>
                      setFormData({ ...formData, intake: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Intake</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </label>

                {/* Status */}
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700 mb-1">Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudent && confirm("Are you sure you want to delete this student?")) {
                      handleDelete(selectedStudent.id);
                      setShowEditModal(false);
                      setSelectedStudent(null);
                    }
                  }}
                  className="ml-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
