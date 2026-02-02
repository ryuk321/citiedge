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
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [filePreview, setFilePreview] = useState<{url: string, name: string} | null>(null);
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({});
  const [editData, setEditData] = useState<Partial<ApplicationLead>>({});
  const [saving, setSaving] = useState(false);

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

  const handleFileView = (filePath: string) => {
    // Use secure API endpoint for file access - pass full path from database
    const fileUrl = `https://admissions.citiedgecollege.co.uk/application_files_api.php?file=${encodeURIComponent(filePath)}`;
    setFilePreview({ url: fileUrl, name: filePath });
  };

  const handleFileDownload = (filePath: string) => {
    // Use direct link approach which is more reliable for file downloads
    const fileUrl = `https://admissions.citiedgecollege.co.uk/application_files_api.php?file=${encodeURIComponent(filePath)}`;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filePath.split('/').pop() || 'download'; // Extract filename from path
    link.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const toggleEditMode = (section: string) => {
    if (editMode[section]) {
      // Cancel edit - reset data
      setEditMode({...editMode, [section]: false});
      setEditData({});
    } else {
      // Enter edit mode - copy current data
      setEditMode({...editMode, [section]: true});
      setEditData(application || {});
    }
  };

  const handleFieldChange = (field: keyof ApplicationLead, value: any) => {
    setEditData({...editData, [field]: value});
  };

  const saveSection = async (section: string) => {
    if (!application) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/applications/update-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          data: editData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state with saved data
        setApplication({...application, ...editData});
        setEditMode({...editMode, [section]: false});
        setEditData({});
        alert('Changes saved successfully!');
      } else {
        alert('Error saving changes: ' + result.error);
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const menuSections = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'course', label: 'Course', icon: '📚' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'english', label: 'English', icon: '🗣️' },
    { id: 'employment', label: 'Employment', icon: '💼' },
    { id: 'references', label: 'References', icon: '📝' },
    { id: 'funding', label: 'Funding', icon: '💰' },
    { id: 'files', label: 'Files', icon: '📎' },
    { id: 'additional', label: 'Additional', icon: 'ℹ️' }
  ];

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

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {application.firstName} {application.middleName} {application.lastName}
            </h1>
            <p className="text-blue-100 text-sm">Application #{application.id} • {application.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(application.status)} border-0 cursor-pointer`}
          >
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="deferred">Deferred</option>
          </select>
          {onEdit && (
            <button
              onClick={() => onEdit(application)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {menuSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto p-8">
            
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Application Overview</h2>
                
                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Status" value={application.status} highlight />
                  <StatCard label="Submitted" value={formatDate(application.submissionDate)} />
                  <StatCard label="Programme" value={application.programme?.substring(0, 30) + '...' || 'N/A'} />
                  <StatCard label="Intake" value={application.intakeDate || 'N/A'} />
                </div>

                {/* Important Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>👤</span> Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <InfoRow label="Full Name" value={`${application.firstName} ${application.middleName || ''} ${application.lastName}`} />
                      <InfoRow label="Email" value={application.email} />
                      <InfoRow label="Phone" value={`${application.phoneCountry} ${application.phone}`} />
                      <InfoRow label="Date of Birth" value={formatDate(application.dateOfBirth)} />
                      <InfoRow label="Nationality" value={application.nationality} />
                      <InfoRow label="Passport" value={application.passportNumber} />
                    </div>
                  </div>

                  {/* Course Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📚</span> Course Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <InfoRow label="Programme" value={application.programme} />
                      <InfoRow label="Level" value={application.levelOfStudy} />
                      <InfoRow label="Study Mode" value={application.studyMode} />
                      <InfoRow label="Campus" value={application.campus} />
                      <InfoRow label="Intake Date" value={application.intakeDate} />
                    </div>
                  </div>

                  {/* Academic Summary */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎓</span> Academic Background
                    </h3>
                    <div className="space-y-2 text-sm">
                      {application.institutionName ? (
                        <>
                          <InfoRow label="Latest Institution" value={application.institutionName} />
                          <InfoRow label="Qualification" value={application.qualification} />
                          <InfoRow label="Subject" value={application.subject} />
                          <InfoRow label="Grade" value={application.grade} />
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No academic history provided</p>
                      )}
                    </div>
                  </div>

                  {/* Funding & Agent Summary */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>💰</span> Funding & Agent
                    </h3>
                    <div className="space-y-2 text-sm">
                      <InfoRow label="Funding Source" value={application.funding} />
                      <InfoRow label="Scholarship" value={application.applyScholarship} />
                      <InfoRow label="Agent Application" value={application.isAgentApplication} />
                      {application.isAgentApplication === 'Yes' && (
                        <>
                          <InfoRow label="Agent Company" value={application.agentCompany} />
                          <InfoRow label="Agent Name" value={application.agentName} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Files Quick View */}
                {application.filePaths && application.filePaths.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📎</span> Attached Documents ({application.filePaths.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {application.filePaths.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate flex-1">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {application.notes && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📌</span> Admin Notes
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                  </div>
                )}
              </div>
            )}
            {/* Personal Information Section */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
                  <div className="flex gap-2">
                    {editMode['personal'] ? (
                      <>
                        <button
                          onClick={() => saveSection('personal')}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : '💾 Save'}
                        </button>
                        <button
                          onClick={() => toggleEditMode('personal')}
                          disabled={saving}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleEditMode('personal')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoField 
                    label="First Name" 
                    value={editMode['personal'] ? editData.firstName : application.firstName}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('firstName', val)}
                  />
                  <InfoField 
                    label="Middle Name" 
                    value={editMode['personal'] ? editData.middleName : application.middleName}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('middleName', val)}
                  />
                  <InfoField 
                    label="Last Name" 
                    value={editMode['personal'] ? editData.lastName : application.lastName}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('lastName', val)}
                  />
                  <InfoField 
                    label="Date of Birth" 
                    value={editMode['personal'] ? editData.dateOfBirth : formatDate(application.dateOfBirth)}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('dateOfBirth', val)}
                  />
                  <InfoField 
                    label="Gender" 
                    value={editMode['personal'] ? editData.gender : application.gender}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('gender', val)}
                  />
                  <InfoField 
                    label="Nationality" 
                    value={editMode['personal'] ? editData.nationality : application.nationality}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('nationality', val)}
                  />
                  <InfoField 
                    label="Country of Residence" 
                    value={editMode['personal'] ? editData.countryOfResidence : application.countryOfResidence}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('countryOfResidence', val)}
                  />
                  <InfoField 
                    label="Passport Number" 
                    value={editMode['personal'] ? editData.passportNumber : application.passportNumber}
                    editable={editMode['personal']}
                    onChange={(val) => handleFieldChange('passportNumber', val)}
                  />
                </div>

                <div className="border-t pt-6 mt-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField 
                      label="Email" 
                      value={editMode['personal'] ? editData.email : application.email}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('email', val)}
                      className="md:col-span-2" 
                    />
                    <InfoField 
                      label="Phone" 
                      value={editMode['personal'] ? editData.phone : application.phone}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('phone', val)}
                    />
                    <InfoField 
                      label="Address" 
                      value={editMode['personal'] ? editData.address : application.address}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('address', val)}
                      multiline
                      className="md:col-span-3" 
                    />
                    <InfoField 
                      label="City" 
                      value={editMode['personal'] ? editData.city : application.city}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('city', val)}
                    />
                    <InfoField 
                      label="State/Province" 
                      value={editMode['personal'] ? editData.state : application.state}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('state', val)}
                    />
                    <InfoField 
                      label="Postal Code" 
                      value={editMode['personal'] ? editData.postalCode : application.postalCode}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('postalCode', val)}
                    />
                    <InfoField 
                      label="Country" 
                      value={editMode['personal'] ? editData.country : application.country}
                      editable={editMode['personal']}
                      onChange={(val) => handleFieldChange('country', val)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Course Selection Section */}
            {activeSection === 'course' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Selection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Programme" value={application.programme} className="md:col-span-2" highlight />
                  <InfoField label="Intake Date" value={application.intakeDate} />
                  <InfoField label="Study Mode" value={application.studyMode} />
                  <InfoField label="Campus" value={application.campus} />
                  <InfoField label="Level of Study" value={application.levelOfStudy} />
                </div>
              </div>
            )}

            {/* Academic History Section */}
            {activeSection === 'academic' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Academic History</h2>
                
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

            {/* English Proficiency Section */}
            {activeSection === 'english' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">English Language Proficiency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Proficiency Type" value={application.englishProficiencyType} className="md:col-span-2" />
                  <InfoField label="Test Name" value={application.testName} />
                  <InfoField label="Test Score" value={application.testScore} />
                  <InfoField label="Test Date" value={formatDate(application.testDate)} className="md:col-span-2" />
                </div>
              </div>
            )}

            {/* Employment History Section */}
            {activeSection === 'employment' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Employment History</h2>
                
                {application.employerName && (
                  <EmploymentEntry
                    title="Employment 1"
                    employer={application.employerName}
                    jobTitle={application.jobTitle}
                    startDate={application.employmentStart}
                    endDate={application.employmentEnd}
                  />
                )}

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

            {/* References Section */}
            {activeSection === 'references' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">References</h2>
                
                {application.refName && (
                  <ReferenceEntry
                    title="Reference 1"
                    name={application.refName}
                    relationship={application.refRelationship}
                    email={application.refEmail}
                    contact={application.refContact}
                  />
                )}

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

            {/* Funding Section */}
            {activeSection === 'funding' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Funding & Agent Information</h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Funding Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Funding Source" value={application.funding} className="md:col-span-2" />
                    <InfoField label="Apply for Scholarship" value={application.applyScholarship} />
                    <InfoField label="Scholarship Name" value={application.scholarshipName} />
                  </div>
                </div>

                <div className="border-t pt-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h3>
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

            {/* Files Section */}
            {activeSection === 'files' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Attached Documents</h2>
                
                {application.filePaths && application.filePaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.filePaths.map((file, idx) => (
                      <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={file}>
                              Document {idx + 1}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 truncate" title={file}>{file}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFileView(file)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                              <button
                                onClick={() => handleFileDownload(file)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No documents attached to this application</p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Information Section */}
            {activeSection === 'additional' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Information</h2>
                
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
                  <div className="border-t pt-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Comments</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{application.additionalInfo}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Declaration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoField label="Declaration Agreed" value={application.declaration} />
                    <InfoField label="Signature Name" value={application.signatureName} />
                    <InfoField label="Signature Date" value={formatDate(application.signatureDate)} />
                  </div>
                </div>

                {application.notes && (
                  <div className="border-t pt-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Notes</h3>
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                    </div>
                  </div>
                )}

                {application.lastUpdated && (
                  <div className="border-t pt-6 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Last Updated" value={formatDate(application.lastUpdated)} />
                      <InfoField label="Assigned To" value={application.assignedTo} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* File Preview Modal */}
      {filePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">{filePreview.name}</h3>
              <button
                onClick={() => setFilePreview(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {filePreview.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={filePreview.url} alt={filePreview.name} className="max-w-full h-auto mx-auto" />
              ) : filePreview.url.match(/\.pdf$/i) ? (
                <iframe src={filePreview.url} className="w-full h-full min-h-[600px]" title={filePreview.name} />
              ) : (
                <div className="text-center py-12">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg mb-4">Preview not available for this file type</p>
                  <button
                    onClick={() => handleFileDownload(filePreview.name)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{ label: string; value?: string; highlight?: boolean }> = ({ 
  label, 
  value, 
  highlight = false 
}) => (
  <div className={`p-4 rounded-lg border-2 ${highlight ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className={`text-lg font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'} truncate capitalize`}>
      {value || 'N/A'}
    </p>
  </div>
);

const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-1">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900 text-right ml-2">{value || 'N/A'}</span>
  </div>
);
const InfoField: React.FC<{ 
  label: string; 
  value?: string | null; 
  className?: string;
  highlight?: boolean;
  editable?: boolean;
  fieldName?: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
}> = ({ label, value, className = '', highlight = false, editable = false, fieldName, onChange, multiline = false }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className={`${!editable && 'p-3'} rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      {editable ? (
        multiline ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full p-3 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded-lg"
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full p-3 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded-lg"
          />
        )
      ) : (
        <p className={`text-gray-900 ${highlight ? 'font-semibold text-lg' : ''}`}>
          {value || 'N/A'}
        </p>
      )}
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
