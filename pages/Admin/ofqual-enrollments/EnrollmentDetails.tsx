import React from 'react';
import { Enrollment } from './OfqualEnrollmentsPage';

interface DetailsProps {
  enrollment: Enrollment | null;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

const EnrollmentDetails: React.FC<DetailsProps> = ({ enrollment, onClose, onUpdateStatus }) => {
  if (!enrollment) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'under_review': 'text-blue-600 bg-blue-50 border-blue-200',
      'approved': 'text-green-600 bg-green-50 border-green-200',
      'rejected': 'text-red-600 bg-red-50 border-red-200',
      'enrolled': 'text-purple-600 bg-purple-50 border-purple-200',
      'withdrawn': 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | boolean | number }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">
        {value === true ? 'Yes' : value === false ? 'No' : value || 'N/A'}
      </dd>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Enrollment Details</h2>
                <p className="text-sm text-gray-600 mt-1 font-mono">{enrollment.application_ref}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Status Update Section */}
                <div className={`border-2 rounded-lg p-4 ${getStatusColor(enrollment.status)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold mb-1">Current Status</p>
                      <p className="text-2xl font-bold uppercase">{enrollment?.status?.replace('_', ' ') ?? 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">Update Status</label>
                      <select
                        value={enrollment.status}
                        onChange={(e) => {
                          if (enrollment.id) {
                            onUpdateStatus(enrollment.id, e.target.value);
                          }
                        }}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray text-sm font-medium text-black"
                      >
                        <option  className="text-black" value="pending">Pending</option>
                        <option   className="text-black" value="under_review">Under Review</option>
                        <option  className="text-black" value="approved">Approved</option>
                        <option className="text-black" value="rejected">Rejected</option>
                        <option className="text-black" value="enrolled">Enrolled</option>
                        <option className="text-black" value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Title" value={enrollment.title} />
                    <InfoRow label="Full Name" value={enrollment.full_name} />
                    <InfoRow label="Preferred Name" value={enrollment.preferred_name} />
                    <InfoRow label="Date of Birth" value={formatDate(enrollment.date_of_birth)} />
                    <InfoRow label="Gender" value={enrollment.gender} />
                    <InfoRow label="Nationality" value={enrollment.nationality} />
                    <InfoRow label="Country of Birth" value={enrollment.country_of_birth} />
                  </dl>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Email" value={enrollment.email} />
                    <InfoRow label="Phone" value={enrollment.phone} />
                    <InfoRow label="Address Line 1" value={enrollment.address_line1} />
                    <InfoRow label="Address Line 2" value={enrollment.address_line2} />
                    <InfoRow label="City" value={enrollment.city} />
                    <InfoRow label="Postcode" value={enrollment.postcode} />
                    <InfoRow label="Country" value={enrollment.country} />
                  </dl>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Emergency Contact
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                    <InfoRow label="Name" value={enrollment.emergency_contact_name} />
                    <InfoRow label="Phone" value={enrollment.emergency_contact_phone} />
                    <InfoRow label="Relationship" value={enrollment.emergency_contact_relationship} />
                  </dl>
                </div>

                {/* ID Verification */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    ID Verification
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                    <InfoRow label="ID Type" value={enrollment.id_type} />
                    <InfoRow label="ID Number" value={enrollment.id_number} />
                    <InfoRow label="NI Number" value={enrollment.ni_number} />
                  </dl>
                </div>

                {/* Course Details */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Course Details
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Course Category" value={enrollment.course_category} />
                    <InfoRow label="Course Level" value={enrollment.course_level} />
                    <InfoRow label="Study Mode" value={enrollment.study_mode} />
                    <InfoRow label="Intended Start Date" value={formatDate(enrollment.start_date)} />
                    <InfoRow label="Awarding Organisation" value={enrollment.awarding_organisation} />
                    <InfoRow label="Funding Type" value={enrollment.funding_type} />
                  </dl>
                </div>

                {/* Previous Qualifications */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Previous Qualifications
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                    <InfoRow label="Highest Qualification" value={enrollment.highest_qualification} />
                    <InfoRow label="Institution Name" value={enrollment.institution_name} />
                    <InfoRow label="Year Completed" value={enrollment.qualification_year} />
                  </dl>
                </div>

                {/* Entry Requirements */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Entry Requirements
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Meets Entry Requirements" value={enrollment.meets_entry_requirements} />
                    <InfoRow label="English Proficiency" value={enrollment.english_proficiency} />
                  </dl>
                </div>

                {/* Equality & Diversity */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Equality & Diversity
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Ethnicity" value={enrollment.ethnicity} />
                    <InfoRow label="Disability" value={enrollment.disability} />
                  </dl>
                  {enrollment.disability_details && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <InfoRow label="Disability Details" value={enrollment.disability_details} />
                    </div>
                  )}
                </div>

                {/* Special Adjustments */}
                {enrollment.require_adjustments === 'yes' && (
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Special Adjustments Required
                    </h3>
                    <InfoRow label="Details" value={enrollment.adjustment_details} />
                  </div>
                )}

                {/* Consent & Declaration */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Consent & Declaration
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="GDPR Consent" value={enrollment.gdpr_consent} />
                    <InfoRow label="Marketing Consent" value={enrollment.marketing_consent} />
                    <InfoRow label="Data Sharing Consent" value={enrollment.data_sharing_consent} />
                    <InfoRow label="Declaration Signed" value={enrollment.declaration_signed} />
                    <InfoRow label="Signature Date" value={formatDate(enrollment.signature_date)} />
                  </dl>
                </div>

                {/* System Information */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    System Information
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InfoRow label="Created At" value={formatDate(enrollment.created_at)} />
                    <InfoRow label="Last Updated" value={formatDate(enrollment.updated_at)} />
                    <InfoRow label="IP Address" value={enrollment.ip_address} />
                  </dl>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentDetails;
