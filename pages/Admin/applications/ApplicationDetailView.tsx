'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationLead } from '@/lib/DB_Table';

interface ApplicationDetailViewProps {
  applicationId: number;
  onClose: () => void;
  onEdit?: (app: ApplicationLead) => void;
  onStatusChange?: (id: number, status: string) => void;
}

const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({ 
  applicationId, 
  onClose, 
  onEdit,
  onStatusChange 
}) => {
  const [application, setApplication] = useState<ApplicationLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('personal');

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/applications/get-application-detail?id=${applicationId}`);
      const data = await response.json();
      
      if (data.success) {
        setApplication(data.data);
      } else {
        setError(data.error || 'Failed to load application details');
      }
    } catch (err) {
      setError('Failed to fetch application details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;
    
    try {
      const response = await fetch('/api/applications/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: application.id, status: newStatus })
      });
      
      if (response.ok) {
        setApplication({ ...application, status: newStatus as any });
        if (onStatusChange) onStatusChange(application.id, newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800',
      'deferred': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 text-center mb-4">{error || 'Application not found'}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'course', label: 'Course Selection', icon: '📚' },
    { id: 'academic', label: 'Academic History', icon: '🎓' },
    { id: 'english', label: 'English Proficiency', icon: '🗣️' },
    { id: 'employment', label: 'Employment', icon: '💼' },
    { id: 'references', label: 'References', icon: '📝' },
    { id: 'funding', label: 'Funding & Agent', icon: '💰' },
    { id: 'additional', label: 'Additional Info', icon: 'ℹ️' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {application.firstName} {application.middleName} {application.lastName}
              </h2>
              <p className="text-blue-100">{application.email}</p>
              <p className="text-blue-100 text-sm">Application ID: {application.id}</p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(application)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-90 text-white rounded-lg"

              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Status and Quick Info */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-200 text-sm">Status:</span>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)} border-0 cursor-pointer`}
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="deferred">Deferred</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-200 text-sm">Submitted:</span>
              <span className="text-white font-medium">{formatDate(application.submissionDate)}</span>
            </div>
            {application.isAgentApplication === 'Yes' && (
              <div className="flex items-center gap-2">
                <span className="text-blue-200 text-sm">Agent:</span>
                <span className="text-white font-medium">{application.agentCompany || 'N/A'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-2 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="First Name" value={application.firstName} />
                <InfoField label="Middle Name" value={application.middleName} />
                <InfoField label="Last Name" value={application.lastName} />
                <InfoField label="Date of Birth" value={formatDate(application.dateOfBirth)} />
                <InfoField label="Gender" value={application.gender} />
                <InfoField label="Nationality" value={application.nationality} />
                <InfoField label="Country of Residence" value={application.countryOfResidence} />
                <InfoField label="Passport Number" value={application.passportNumber} />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Email" value={application.email} />
                  <InfoField label="Phone" value={`${application.phoneCountry} ${application.phone}`} />
                  <InfoField label="Address" value={application.address} className="md:col-span-2" />
                  <InfoField label="City" value={application.city} />
                  <InfoField label="State/Province" value={application.state} />
                  <InfoField label="Postal Code" value={application.postalCode} />
                  <InfoField label="Country" value={application.country} />
                </div>
              </div>
            </div>
          )}

          {/* Course Selection Tab */}
          {activeTab === 'course' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Programme" value={application.programme} className="md:col-span-2" highlight />
                <InfoField label="Intake Date" value={application.intakeDate} />
                <InfoField label="Study Mode" value={application.studyMode} />
                <InfoField label="Campus" value={application.campus} />
                <InfoField label="Level of Study" value={application.levelOfStudy} />
              </div>
            </div>
          )}

          {/* Academic History Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-8">
              {/* First Entry */}
              {application.institutionName && (
                <AcademicEntry
                  title="Academic Qualification 1"
                  institution={application.institutionName}
                  country={application.countryOfStudy}
                  qualification={application.qualification}
                  subject={application.subject}
                  startDate={application.startDate}
                  endDate={application.endDate}
                  grade={application.grade}
                />
              )}

              {/* Second Entry */}
              {application.institutionName2 && (
                <AcademicEntry
                  title="Academic Qualification 2"
                  institution={application.institutionName2}
                  country={application.countryOfStudy2}
                  qualification={application.qualification2}
                  subject={application.subject2}
                  startDate={application.startDate2}
                  endDate={application.endDate2}
                  grade={application.grade2}
                />
              )}

              {/* Third Entry */}
              {application.institutionName3 && (
                <AcademicEntry
                  title="Academic Qualification 3"
                  institution={application.institutionName3}
                  country={application.countryOfStudy3}
                  qualification={application.qualification3}
                  subject={application.subject3}
                  startDate={application.startDate3}
                  endDate={application.endDate3}
                  grade={application.grade3}
                />
              )}

              {!application.institutionName && (
                <p className="text-gray-500 italic">No academic history provided</p>
              )}
            </div>
          )}

          {/* English Proficiency Tab */}
          {activeTab === 'english' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Proficiency Type" value={application.englishProficiencyType} className="md:col-span-2" />
                <InfoField label="Test Name" value={application.testName} />
                <InfoField label="Test Score" value={application.testScore} />
                <InfoField label="Test Date" value={formatDate(application.testDate)} className="md:col-span-2" />
              </div>
            </div>
          )}

          {/* Employment History Tab */}
          {activeTab === 'employment' && (
            <div className="space-y-8">
              {/* First Employment */}
              {application.employerName && (
                <EmploymentEntry
                  title="Employment 1"
                  employer={application.employerName}
                  jobTitle={application.jobTitle}
                  startDate={application.employmentStart}
                  endDate={application.employmentEnd}
                />
              )}

              {/* Second Employment */}
              {application.employerName2 && (
                <EmploymentEntry
                  title="Employment 2"
                  employer={application.employerName2}
                  jobTitle={application.jobTitle2}
                  startDate={application.employmentStart2}
                  endDate={application.employmentEnd2}
                />
              )}

              {!application.employerName && (
                <p className="text-gray-500 italic">No employment history provided</p>
              )}
            </div>
          )}

          {/* References Tab */}
          {activeTab === 'references' && (
            <div className="space-y-8">
              {/* First Reference */}
              {application.refName && (
                <ReferenceEntry
                  title="Reference 1"
                  name={application.refName}
                  relationship={application.refRelationship}
                  email={application.refEmail}
                  contact={application.refContact}
                />
              )}

              {/* Second Reference */}
              {application.refName2 && (
                <ReferenceEntry
                  title="Reference 2"
                  name={application.refName2}
                  relationship={application.refRelationship2}
                  email={application.refEmail2}
                  contact={application.refContact2}
                />
              )}

              {!application.refName && (
                <p className="text-gray-500 italic">No references provided</p>
              )}
            </div>
          )}

          {/* Funding & Agent Tab */}
          {activeTab === 'funding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Funding Source" value={application.funding} className="md:col-span-2" />
                  <InfoField label="Apply for Scholarship" value={application.applyScholarship} />
                  <InfoField label="Scholarship Name" value={application.scholarshipName} />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Agent Application" value={application.isAgentApplication} />
                  {application.isAgentApplication === 'Yes' && (
                    <>
                      <InfoField label="Agent Name" value={application.agentName} />
                      <InfoField label="Agent Company" value={application.agentCompany} />
                      <InfoField label="Agent Email" value={application.agentEmail} />
                      <InfoField label="Agent Phone" value={application.agentPhone} />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Tab */}
          {activeTab === 'additional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Has Disability" value={application.disability} />
                {application.disability === 'Yes' && (
                  <InfoField label="Disability Details" value={application.disabilityDetails} className="md:col-span-2" />
                )}
                <InfoField label="Criminal Conviction" value={application.criminalConviction} />
                {application.criminalConviction === 'Yes' && (
                  <InfoField label="Conviction Details" value={application.convictionDetails} className="md:col-span-2" />
                )}
              </div>

              {application.additionalInfo && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Comments</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.additionalInfo}</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Declaration Agreed" value={application.declaration} />
                  <InfoField label="Signature Name" value={application.signatureName} />
                  <InfoField label="Signature Date" value={formatDate(application.signatureDate)} />
                </div>
              </div>

              {application.filePaths && application.filePaths.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Files</h3>
                  <div className="space-y-2">
                    {application.filePaths.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {application.notes && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {application.lastUpdated && (
              <span>Last updated: {formatDate(application.lastUpdated)}</span>
            )}
            {application.assignedTo && (
              <span className="ml-4">Assigned to: {application.assignedTo}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoField: React.FC<{ 
  label: string; 
  value?: string | null; 
  className?: string;
  highlight?: boolean;
}> = ({ label, value, className = '', highlight = false }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className={`p-3 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <p className={`text-gray-900 ${highlight ? 'font-semibold text-lg' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const AcademicEntry: React.FC<{
  title: string;
  institution?: string;
  country?: string;
  qualification?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}> = ({ title, institution, country, qualification, subject, startDate, endDate, grade }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Institution" value={institution} />
      <InfoField label="Country" value={country} />
      <InfoField label="Qualification" value={qualification} />
      <InfoField label="Subject" value={subject} />
      <InfoField label="Start Date" value={startDate} />
      <InfoField label="End Date" value={endDate} />
      <InfoField label="Grade" value={grade} className="md:col-span-2" />
    </div>
  </div>
);

const EmploymentEntry: React.FC<{
  title: string;
  employer?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
}> = ({ title, employer, jobTitle, startDate, endDate }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Employer" value={employer} />
      <InfoField label="Job Title" value={jobTitle} />
      <InfoField label="Start Date" value={startDate} />
      <InfoField label="End Date" value={endDate} />
    </div>
  </div>
);

const ReferenceEntry: React.FC<{
  title: string;
  name?: string;
  relationship?: string;
  email?: string;
  contact?: string;
}> = ({ title, name, relationship, email, contact }) => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField label="Name" value={name} />
      <InfoField label="Relationship" value={relationship} />
      <InfoField label="Email" value={email} />
      <InfoField label="Contact" value={contact} />
    </div>
  </div>
);

export default ApplicationDetailView;
