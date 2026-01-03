import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../../lib/api';
import Notification, { NotificationProps } from '../../../components/Notification';
import { useProtectedRoute, logout, getAuthUser } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
    reference_id?: string;
    created_at?: string;
}

interface StudentOption {
    student_number: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface StaffOption {
    staff_id: string;
    first_name: string;
    last_name: string;
    email: string;
}

const UsersPage: React.FC = () => {
    // Protect this page - only super_admin and admin can access
    useProtectedRoute(['super_admin', 'admin']);
    
    const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<NotificationProps | null>(null);
    const [students, setStudents] = useState<StudentOption[]>([]);
    const [staffList, setStaffList] = useState<StaffOption[]>([]);
    const [selectedReference, setSelectedReference] = useState<StudentOption | StaffOption | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'staff',
        status: 'active',
        reference_id: '',
    });

    // Fetch users data
    const loadUsers = async () => {
        setLoading(true);
        const result = await usersAPI.getAll();
        // alert(JSON.stringify(result.data.data));
        if (result.success) {
            const fetchedUsers = result.data.data
            setUsers(fetchedUsers);
            // alert("Users " + JSON.stringify(fetchedUsers));
            
        }
       
        setLoading(false);
    };

    // Fetch students for dropdown
    const loadStudents = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=getStudents`,
                {
                    headers: {
                        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    // Fetch staff for dropdown
    const loadStaff = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}?action=getStaff`,
                {
                    headers: {
                        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setStaffList(data.data);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    // Handle role change to fetch appropriate list
    const handleRoleChange = (role: string) => {
        setFormData({ ...formData, role, email: '', reference_id: '' });
        setSelectedReference(null);
        
        if (role === 'student' && students.length === 0) {
            loadStudents();
        } else if (role === 'staff' && staffList.length === 0) {
            loadStaff();
        }
    };

    // Handle email selection for student/staff
    const handleEmailSelect = (email: string) => {
        if (formData.role === 'student') {
            const student = students.find(s => s.email === email);
            if (student) {
                setSelectedReference(student);
                setFormData({
                    ...formData,
                    email: student.email,
                    username: `${student.first_name} ${student.last_name}`,
                    reference_id: student.student_number,
                });
            }
        } else if (formData.role === 'staff') {
            const staff = staffList.find(s => s.email === email);
            if (staff) {
                setSelectedReference(staff);
                setFormData({
                    ...formData,
                    email: staff.email,
                    username: `${staff.first_name} ${staff.last_name}`,
                    reference_id: staff.staff_id,
                });
            }
        }
    };

    // Add new user
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Hash the password before sending to server
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formData.password, salt);
        
        const dataToSend = {
            ...formData,
            password: hashedPassword
        };
        // alert("Data to send: " + JSON.stringify(dataToSend));
        const result = await usersAPI.create(dataToSend);
        if (result.success) {
            setNotification({
                type: 'success',
                message: 'User created successfully!',
                duration: 4000
            });
            loadUsers();
            setShowAddForm(false);
            setFormData({ username: '', email: '', password: '', role: 'staff', status: 'active', reference_id: '' });
            setSelectedReference(null);
        } else {
            setNotification({
                type: 'error',
                message: result.error || 'Failed to create user. Please try again.',
                duration: 4000
            });
        }
    };

    // Open edit modal
    const handleMore = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
            reference_id: user.reference_id || '',
        });
        setShowEditModal(true);
    };

    // Update user
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const updateData: any = { ...formData };
        // Don't send password if it's empty, otherwise hash it
        if (!updateData.password) {
            delete updateData.password;
        } else {
            // Hash the password before sending to server
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const result = await usersAPI.update(selectedUser.id, updateData);
        if (result.success) {
            setNotification({
                type: 'success',
                message: 'User updated successfully!',
                duration: 4000
            });
            loadUsers();
            setShowEditModal(false);
            setSelectedUser(null);
            setFormData({ username: '', email: '', password: '', role: 'staff', status: 'active', reference_id: '' });
            setSelectedReference(null);
        } else {
            setNotification({
                type: 'error',
                message: result.error || 'Failed to update user. Please try again.',
                duration: 4000
            });
        }
    };

    // Delete user
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            const result = await usersAPI.delete(id);
            if (result.success) {
                setNotification({
                    type: 'success',
                    message: 'User deleted successfully!',
                    duration: 4000
                });
                loadUsers();
            } else {
                setNotification({
                    type: 'error',
                    message: result.error || 'Failed to delete user. Please try again.',
                    duration: 4000
                });
            }
        }
    };

    // Load data on mount
    useEffect(() => {
        loadUsers();
         
    }, []);

    // Filter users based on search
    const filteredUsers = users.filter(
        (user) =>
        
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
      

    return (
        <div className="space-y-6">
            {/* Notification Display */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add User
                    </button>
                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{currentUser?.username || currentUser?.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
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

            {/* Add User Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add New User</h3>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Role Selection - Should come first to determine other fields */}
                            <select
                                value={formData.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                            >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="student">Student</option>
                                <option value="agent">Agent</option>
                            </select>

                            {/* Email - Dropdown for student/staff, input for others */}
                            {formData.role === 'student' ? (
                                <select
                                    value={formData.email}
                                    onChange={(e) => handleEmailSelect(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                                    required
                                >
                                    <option value="">Select Student Email</option>
                                    {students.map((student) => (
                                        <option key={student.student_number} value={student.email}>
                                            {student.email} - {student.first_name} {student.last_name} ({student.student_number})
                                        </option>
                                    ))}
                                </select>
                            ) : formData.role === 'staff' || formData.role === 'lecturer' ? (
                                <select
                                    value={formData.email}
                                    onChange={(e) => handleEmailSelect(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                                    required
                                >
                                    <option value="">Select Staff Email</option>
                                    {staffList.map((staff) => (
                                        <option key={staff.staff_id} value={staff.email}>
                                            {staff.email} - {staff.first_name} {staff.last_name} ({staff.staff_id})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                                    required
                                />
                            )}

                            {/* Username - Auto-populated for student/staff */}
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                                required
                                readOnly={formData.role === 'student' || formData.role === 'staff' || formData.role === 'lecturer'}
                            />

                            {/* Reference ID Display (readonly) */}
                            {(formData.role === 'student' || formData.role === 'staff' || formData.role === 'lecturer') && formData.reference_id && (
                                <input
                                    type="text"
                                    placeholder="Reference ID"
                                    value={formData.reference_id}
                                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-black"
                                    readOnly
                                />
                            )}
                            
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                                required
                            />
                            
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Save User
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({ 
                                        username: '', 
                                        email: '', 
                                        password: '', 
                                        role: 'staff', 
                                        status: 'active', 
                                        reference_id: '' 
                                    });
                                    setSelectedReference(null);
                                }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reference ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Loading users...
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                        {user.reference_id ? (
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                {user.reference_id}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'super_admin'
                                                ? 'bg-red-100 text-red-800'
                                                : user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : user.role === 'staff'
                                                ? 'bg-blue-100 text-blue-800'
                                                : user.role === 'lecturer'
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : user.role === 'student'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {user.role === 'super_admin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : user.status === 'suspended'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleMore(user)}
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
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

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Edit User Details</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700 mb-1">Username</span>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        required
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700 mb-1">Email</span>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        required
                                    />
                                </label>

                                <label className="flex flex-col md:col-span-2">
                                    <span className="text-sm text-gray-700 mb-1">
                                        Password (leave empty to keep current)
                                    </span>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="Enter new password or leave empty"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700 mb-1">Role</span>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                    >
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                        <option value="lecturer">Lecturer</option>
                                        <option value="student">Student</option>
                                        <option value="agent">Agent</option>
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm text-gray-700 mb-1">Status</span>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Update User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedUser && confirm('Are you sure you want to delete this user?')) {
                                            handleDelete(selectedUser.id);
                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                        }
                                    }}
                                    className="ml-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
