import React, { useState, useEffect } from 'react';
import { staffAPI } from '../../../lib/api';
import Notification, { NotificationProps } from '../../../components/Notification';
import { StaffInfo } from '../../../lib/DB_Table';
import { useProtectedRoute, logout, getAuthUser } from '../../../lib/auth';

// ========== REUSABLE FORM SECTION COMPONENT (OUTSIDE MAIN COMPONENT) ==========
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

// ========== REUSABLE INPUT COMPONENT (OUTSIDE MAIN COMPONENT) ==========
const InputField: React.FC<{
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    options?: string[];
    fullWidth?: boolean;
    placeholder?: string;
    value: any;
    onChange: (name: string, value: any) => void;
}> = ({ label, name, type = 'text', required = false, options, fullWidth = false, placeholder, value, onChange }) => (
    <label className={`flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
        <span className="text-sm text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </span>
        {options ? (
            <select
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                required={required}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : type === 'textarea' ? (
            <textarea
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                placeholder={placeholder}
                rows={3}
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                placeholder={placeholder}
                required={required}
            />
        )}
    </label>
);

const StaffPage: React.FC = () => {
    // Protect this page - admin, super_admin, and staff can access
    useProtectedRoute(['super_admin', 'admin', 'staff', 'lecturer']);
    
    const [currentUser, setCurrentUser] = useState<ReturnType<typeof getAuthUser>>(null);
    
    // ========== STATE MANAGEMENT ==========
    const [staff, setStaff] = useState<StaffInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffInfo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<NotificationProps | null>(null);

    // ========== FORM DATA WITH ALL FIELDS ==========
    const initialFormData = {
        staff_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        mobile: '',
        emergency_contact: '',
        emergency_phone: '',
        dob: '',
        age: '',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        address: '',
        city: '',
        postal_code: '',
        country: '',
        nationality: '',
        national_id: '',
        employee_type: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract' | 'Visiting',
        position: '',
        department: '',
        office_location: '',
        qualification: '',
        specialization: '',
        hire_date: '',
        contract_start: '',
        contract_end: '',
        salary: '',
        salary_currency: 'GBP',
        bank_account: '',
        bank_name: '',
        subjects_taught: '',
        office_hours: '',
        status: 'active' as 'active' | 'inactive' | 'on_leave' | 'terminated' | 'retired',
        access_level: '',
        photo_url: '',
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // ========== API FUNCTIONS ==========
    const loadStaff = async () => {
        setLoading(true);
        const result = await staffAPI.getAll();
        if (result.success) {
            const staffData = result.data.data || result.data;
            setStaff(Array.isArray(staffData) ? staffData : []);
        } else {
            setStaff([]);
            setNotification({ type: 'error', message: 'Failed to load staff members', duration: 4000 });
        }
        setLoading(false);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await staffAPI.create(formData);
        if (result.success) {
            setNotification({ type: 'success', message: 'Staff member created successfully!', duration: 4000 });
            loadStaff();
            setShowAddForm(false);
            setFormData(initialFormData);
        } else {
            setNotification({ type: 'error', message: result.error || 'Failed to create staff member', duration: 4000 });
        }
    };

    const handleUpdateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff) return;

        const result = await staffAPI.update(selectedStaff.id!.toString(), formData);
        if (result.success) {
            setNotification({ type: 'success', message: 'Staff member updated successfully!', duration: 4000 });
            loadStaff();
            setShowEditModal(false);
            setSelectedStaff(null);
            setFormData(initialFormData);
        } else {
            setNotification({ type: 'error', message: result.error || 'Failed to update staff member', duration: 4000 });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this staff member?')) {
            const result = await staffAPI.delete(id.toString());
            if (result.success) {
                setNotification({ type: 'success', message: 'Staff member deleted successfully!', duration: 4000 });
                loadStaff();
            } else {
                setNotification({ type: 'error', message: result.error || 'Failed to delete staff member', duration: 4000 });
            }
        }
    };

    const openEditModal = (member: StaffInfo) => {
        setSelectedStaff(member);
        setFormData({
            staff_id: member.staff_id || '',
            first_name: member.first_name || '',
            last_name: member.last_name || '',
            email: member.email || '',
            phone: member.phone || '',
            mobile: member.mobile || '',
            emergency_contact: member.emergency_contact || '',
            emergency_phone: member.emergency_phone || '',
            dob: member.dob || '',
            age: member.age?.toString() || '',
            gender: member.gender || 'Male',
            address: member.address || '',
            city: member.city || '',
            postal_code: member.postal_code || '',
            country: member.country || '',
            nationality: member.nationality || '',
            national_id: member.national_id || '',
            employee_type: member.employee_type || 'Full-Time',
            position: member.position || '',
            department: member.department || '',
            office_location: member.office_location || '',
            qualification: member.qualification || '',
            specialization: member.specialization || '',
            hire_date: member.hire_date || '',
            contract_start: member.contract_start || '',
            contract_end: member.contract_end || '',
            salary: member.salary?.toString() || '',
            salary_currency: member.salary_currency || 'GBP',
            bank_account: member.bank_account || '',
            bank_name: member.bank_name || '',
            subjects_taught: member.subjects_taught || '',
            office_hours: member.office_hours || '',
            status: member.status || 'active',
            access_level: member.access_level || '',
            photo_url: member.photo_url || '',
            notes: member.notes || '',
        });
        setShowEditModal(true);
    };

    useEffect(() => {
        loadStaff();
    }, []);

    // ========== FILTERING ==========
    const filteredStaff = Array.isArray(staff) ? staff.filter((member) =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.staff_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (member.department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ) : [];

    // ========== HELPER FUNCTION TO UPDATE FORM ==========
    const updateFormField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ========== RENDER FORM ==========
    const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean = false) => (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormSection title="Basic Information">
                <InputField label="Staff ID" name="staff_id" required placeholder="e.g., STF001" value={formData.staff_id} onChange={updateFormField} />
                <InputField label="Status" name="status" options={['active', 'inactive', 'on_leave', 'terminated', 'retired']} value={formData.status} onChange={updateFormField} />
                <InputField label="First Name" name="first_name" required value={formData.first_name} onChange={updateFormField} />
                <InputField label="Last Name" name="last_name" required value={formData.last_name} onChange={updateFormField} />
                <InputField label="Email" name="email" type="email" required value={formData.email} onChange={updateFormField} />
                <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={updateFormField} />
                <InputField label="Mobile" name="mobile" type="tel" value={formData.mobile} onChange={updateFormField} />
                <InputField label="Gender" name="gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Personal Details">
                <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={updateFormField} />
                <InputField label="Age" name="age" type="number" value={formData.age} onChange={updateFormField} />
                <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={updateFormField} />
                <InputField label="National ID" name="national_id" value={formData.national_id} onChange={updateFormField} />
                <InputField label="Address" name="address" fullWidth value={formData.address} onChange={updateFormField} />
                <InputField label="City" name="city" value={formData.city} onChange={updateFormField} />
                <InputField label="Postal Code" name="postal_code" value={formData.postal_code} onChange={updateFormField} />
                <InputField label="Country" name="country" value={formData.country} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Emergency Contact">
                <InputField label="Emergency Contact Name" name="emergency_contact" value={formData.emergency_contact} onChange={updateFormField} />
                <InputField label="Emergency Phone" name="emergency_phone" type="tel" value={formData.emergency_phone} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Employment Details">
                <InputField label="Employee Type" name="employee_type" options={['Full-Time', 'Part-Time', 'Contract', 'Visiting']} required value={formData.employee_type} onChange={updateFormField} />
                <InputField label="Position" name="position" required placeholder="e.g., Professor, Lecturer" value={formData.position} onChange={updateFormField} />
                <InputField label="Department" name="department" required placeholder="e.g., Computer Science" value={formData.department} onChange={updateFormField} />
                <InputField label="Office Location" name="office_location" value={formData.office_location} onChange={updateFormField} />
                <InputField label="Qualification" name="qualification" placeholder="e.g., PhD, MSc" value={formData.qualification} onChange={updateFormField} />
                <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={updateFormField} />
                <InputField label="Hire Date" name="hire_date" type="date" value={formData.hire_date} onChange={updateFormField} />
                <InputField label="Contract Start" name="contract_start" type="date" value={formData.contract_start} onChange={updateFormField} />
                <InputField label="Contract End" name="contract_end" type="date" value={formData.contract_end} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Financial Information">
                <InputField label="Salary" name="salary" type="number" value={formData.salary} onChange={updateFormField} />
                <InputField label="Currency" name="salary_currency" options={['GBP', 'USD', 'EUR']} value={formData.salary_currency} onChange={updateFormField} />
                <InputField label="Bank Account" name="bank_account" value={formData.bank_account} onChange={updateFormField} />
                <InputField label="Bank Name" name="bank_name" value={formData.bank_name} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Academic Information">
                <InputField label="Subjects Taught" name="subjects_taught" fullWidth placeholder="e.g., AI, Machine Learning" value={formData.subjects_taught} onChange={updateFormField} />
                <InputField label="Office Hours" name="office_hours" fullWidth placeholder="e.g., Mon 2-4pm, Wed 10-12pm" value={formData.office_hours} onChange={updateFormField} />
            </FormSection>

            <FormSection title="Additional Information">
                <InputField label="Access Level" name="access_level" value={formData.access_level} onChange={updateFormField} />
                <InputField label="Photo URL" name="photo_url" type="url" value={formData.photo_url} onChange={updateFormField} />
                <InputField label="Notes" name="notes" type="textarea" fullWidth value={formData.notes} onChange={updateFormField} />
            </FormSection>

            <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    {isEdit ? 'Update Staff' : 'Save Staff'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        isEdit ? setShowEditModal(false) : setShowAddForm(false);
                        setFormData(initialFormData);
                        setSelectedStaff(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    );


    // ========== MAIN RENDER ==========
    return (
        <div className="space-y-6">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search staff by name, email, ID, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 text-black"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Staff
                    </button>
                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{currentUser?.username || currentUser?.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all">
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

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Staff Member</h3>
                    {renderForm(handleAddStaff)}
                </div>
            )}

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Staff ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading staff...</td>
                                </tr>
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No staff members found</td>
                                </tr>
                            ) : (
                                filteredStaff.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.staff_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{member.first_name} {member.last_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{member.position}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{member.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                member.status === 'active' ? 'bg-green-100 text-green-800' :
                                                member.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                                                member.status === 'terminated' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {member.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id!)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
<div className="fixed inset-0 bg-blue-500/40 backdrop-blur-md flex items-center justify-center z-50 p-4">                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Edit Staff Member</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedStaff(null);
                                    setFormData(initialFormData);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {renderForm(handleUpdateStaff, true)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



export default StaffPage;
