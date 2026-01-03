import React, { useState, useEffect } from 'react';
import { StudentInfo } from '../../../lib/DB_Table';

// Extended form data with additional registration fields
interface StudentRegistrationForm extends Omit<StudentInfo, 'id' | 'created_at' | 'updated_at'> {
  middle_name?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  parent_guardian_name?: string;
  parent_guardian_phone?: string;
  parent_guardian_email?: string;
  previous_institution?: string;
  previous_qualification?: string;
  passport_id?: string;
  blood_group?: string;
  medical_conditions?: string;
}
const AddStudent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentRegistrationForm>({
    student_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    dob: '',
    age: 0,
    gender: undefined,
    address: '',
    nationality: '',
    course_id: 0,
    enrollment_date: '',
    intake: '',
    status: 'active',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    parent_guardian_name: '',
    parent_guardian_phone: '',
    parent_guardian_email: '',
    previous_institution: '',
    previous_qualification: '',
    passport_id: '',
    blood_group: '',
    medical_conditions: '',
  });

  // Auto-calculate age from DOB
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle DOB change and auto-calculate age
  const handleDobChange = (dob: string) => {
    const age = calculateAge(dob);
    setFormData(prev => ({ ...prev, dob, age }));
  };

  // Register global show function
  useEffect(() => {
  
   
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(1);
    // Reset form
    setFormData({
      student_number: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone: '',
      dob: '',
      age: 0,
      gender: undefined,
      address: '',
      nationality: '',
      course_id: 0,
      enrollment_date: '',
      intake: '',
      status: 'active',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      parent_guardian_name: '',
      parent_guardian_phone: '',
      parent_guardian_email: '',
      previous_institution: '',
      previous_qualification: '',
      passport_id: '',
      blood_group: '',
      medical_conditions: '',
    });
  };

  const generateStudentId = async () => {
    try {
      setGeneratingId(true);
      const response = await fetch('/api/student/generate-id');
      const data = await response.json();

      if (data.success && data.studentId) {
        setFormData((prev) => ({ ...prev, student_number: data.studentId }));
      } else {
        console.error('Failed to generate student ID:', data.error);
        alert('Failed to generate student ID. Please try again.');
      }
    } catch (error) {
      console.error('Error generating student ID:', error);
      alert('Error generating student ID. Please try again.');
    } finally {
      setGeneratingId(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare data - remove extra fields not in StudentInfo
      const studentData: Partial<StudentInfo> = {
        student_number: formData.student_number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        nationality: formData.nationality,
        course_id: formData.course_id,
        enrollment_date: formData.enrollment_date,
        intake: formData.intake,
        status: formData.status,
      };

      const response = await fetch(
        'http://localhost/citiedge_portal/student_api.php?action=add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'super-secret-key',
          },
          body: JSON.stringify(studentData),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Student registered successfully!');
        // Call refresh callback if available
        // if (globalRefreshStudents) {
        //   globalRefreshStudents();
        // }
        // Close modal and reset
        handleClose();
      } else {
        alert('Error: ' + (data.error || 'Failed to add student'));
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student. Please try again.');
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const totalSteps = 3;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Student Registration</h2>
            <p className="text-blue-100 text-sm mt-1">
              Complete all required fields to register a new student
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600 font-medium">
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? 'Personal Information' :
                currentStep === 2 ? 'Contact & Academic Details' :
                'Emergency & Additional Information'
              }
            </span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleAddStudent} className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Student Number */}
                <div className="lg:col-span-3">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="text-red-500 mr-1">*</span>
                        Student Number
                      </span>
                      <button
                        type="button"
                        onClick={generateStudentId}
                        disabled={generatingId}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline disabled:text-gray-400"
                      >
                        {generatingId ? 'Generating...' : 'Regenerate ID'}
                      </button>
                    </span>
                    <input
                      type="text"
                      value={formData.student_number}
                      onChange={(e) =>
                        setFormData({ ...formData, student_number: e.target.value })
                      }
                      maxLength={8}
                      pattern="[0-9]{8}"
                      placeholder="10000001"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-mono text-lg"
                      required
                    />
                    <span className="text-xs text-gray-500 mt-1">8-digit auto-generated student ID</span>
                  </label>
                </div>

                {/* First Name */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    First Name
                  </span>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="John"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                {/* Middle Name */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Middle Name</span>
                  <input
                    type="text"
                    value={formData.middle_name}
                    onChange={(e) =>
                      setFormData({ ...formData, middle_name: e.target.value })
                    }
                    placeholder="Optional"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Last Name */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    Last Name
                  </span>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Doe"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                {/* Date of Birth */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    Date of Birth
                  </span>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                {/* Age (Auto-calculated) */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Age</span>
                  <input
                    type="number"
                    value={formData.age || ''}
                    readOnly
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Auto-calculated"
                  />
                </label>

                {/* Gender */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    Gender
                  </span>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as "Male" | "Female" | "Other" })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                {/* Nationality */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Nationality</span>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    placeholder="e.g., British, American"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Passport/ID Number */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Passport/ID Number</span>
                  <input
                    type="text"
                    value={formData.passport_id}
                    onChange={(e) =>
                      setFormData({ ...formData, passport_id: e.target.value })
                    }
                    placeholder="Passport or National ID"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Blood Group */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Blood Group</span>
                  <select
                    value={formData.blood_group}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_group: e.target.value })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </label>

                {/* Address */}
                <label className="flex flex-col lg:col-span-3">
                  <span className="text-sm font-medium text-gray-700 mb-2">Residential Address</span>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Full residential address"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </label>
              </div>
            )}

            {/* STEP 2: Contact & Academic Details */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="student@example.com"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </label>

                {/* Phone */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Phone Number</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+44 1234 567890"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Course */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500 mr-1">*</span>
                    Course/Program
                  </span>
                  <select
                    value={formData.course_id || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, course_id: Number(e.target.value) })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="1">BSc Computer Science</option>
                    <option value="2">BSc Business Management</option>
                    <option value="3">MSc Data Science</option>
                    <option value="4">MSc Cybersecurity</option>
                    <option value="5">Diploma in IT (Level 4)</option>
                    <option value="6">Diploma in Business (Level 5)</option>
                  </select>
                </label>

                {/* Intake */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Intake Period</span>
                  <select
                    value={formData.intake}
                    onChange={(e) =>
                      setFormData({ ...formData, intake: e.target.value })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Intake</option>
                    <option value="January 2026">January 2026</option>
                    <option value="March 2026">March 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </label>

                {/* Enrollment Date */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Enrollment Date</span>
                  <input
                    type="date"
                    value={formData.enrollment_date}
                    onChange={(e) =>
                      setFormData({ ...formData, enrollment_date: e.target.value })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Status */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "graduated" | "withdrawn" })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </label>

                {/* Previous Institution */}
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-2">Previous Institution</span>
                  <input
                    type="text"
                    value={formData.previous_institution}
                    onChange={(e) =>
                      setFormData({ ...formData, previous_institution: e.target.value })
                    }
                    placeholder="Name of previous school/college/university"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Previous Qualification */}
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-2">Previous Qualification</span>
                  <input
                    type="text"
                    value={formData.previous_qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, previous_qualification: e.target.value })
                    }
                    placeholder="e.g., A-Levels, BTEC, Bachelor's Degree"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
              </div>
            )}

            {/* STEP 3: Emergency & Additional Information */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Emergency Contact Details
                  </h3>
                </div>

                {/* Emergency Contact Name */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</span>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact_name: e.target.value })
                    }
                    placeholder="Full name"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Emergency Contact Phone */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</span>
                  <input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact_phone: e.target.value })
                    }
                    placeholder="+44 1234 567890"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Emergency Contact Relationship */}
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-2">Relationship</span>
                  <select
                    value={formData.emergency_contact_relationship}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact_relationship: e.target.value })
                    }
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Parent/Guardian Information
                  </h3>
                </div>

                {/* Parent/Guardian Name */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name</span>
                  <input
                    type="text"
                    value={formData.parent_guardian_name}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_guardian_name: e.target.value })
                    }
                    placeholder="Full name"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Parent/Guardian Phone */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-2">Parent/Guardian Phone</span>
                  <input
                    type="tel"
                    value={formData.parent_guardian_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_guardian_phone: e.target.value })
                    }
                    placeholder="+44 1234 567890"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Parent/Guardian Email */}
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-2">Parent/Guardian Email</span>
                  <input
                    type="email"
                    value={formData.parent_guardian_email}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_guardian_email: e.target.value })
                    }
                    placeholder="parent@example.com"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>

                {/* Medical Conditions */}
                <label className="flex flex-col md:col-span-2 mt-4">
                  <span className="text-sm font-medium text-gray-700 mb-2">Medical Conditions/Allergies</span>
                  <textarea
                    value={formData.medical_conditions}
                    onChange={(e) =>
                      setFormData({ ...formData, medical_conditions: e.target.value })
                    }
                    placeholder="Please list any medical conditions, allergies, or special requirements..."
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Form Navigation Buttons */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-bold shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Register Student
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;