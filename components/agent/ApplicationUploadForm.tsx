/**
 * Agent Application Upload Form
 * 
 * Comprehensive form for agents to submit student applications
 * Matches the structure from index.php
 */

import { useState, useEffect} from 'react';
import { AgentApplication, AcademicRecord, EmploymentRecord, Reference, createApplication } from '@/lib/agentData';
import Notification, { NotificationProps } from '../Notification';

interface ApplicationFormProps {
  agentId: string;
  agentName: string;
  company_name: string;
  onSuccess: () => void;
}

export default function ApplicationUploadForm({ agentId, agentName, company_name, onSuccess }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  
  const [currentSection, setCurrentSection] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<AgentApplication>>({
    agent_id: agentId,
    agent_name: agentName,
    academicHistory: [{ qualification: '', institution: '', country: '', dateFrom: '', dateTo: '', grade: '' }],
    employmentHistory: [],
    references: [{ name: '', relationship: '', email: '', contact: '' }],
    documents: [],
    disability: 'No',
    disabilityDetails: '',
    criminalConviction: 'No',
    convictionDetails: '',
    additionalInfo: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addAcademicRecord = () => {
    setFormData(prev => ({
      ...prev,
      academicHistory: [...(prev.academicHistory || []), { qualification: '', institution: '', country: '', dateFrom: '', dateTo: '', grade: '' }]
    }));
  };

  const removeAcademicRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      academicHistory: prev.academicHistory?.filter((_, i) => i !== index)
    }));
  };

  const updateAcademicRecord = (index: number, field: keyof AcademicRecord, value: string) => {
    setFormData(prev => ({
      ...prev,
      academicHistory: prev.academicHistory?.map((record, i) => 
        i === index ? { ...record, [field]: value } : record
      )
    }));
  };

  const addEmploymentRecord = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [...(prev.employmentHistory || []), { position: '', employer: '', country: '', dateFrom: '', dateTo: '', responsibilities: '' }]
    }));
  };

  const removeEmploymentRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory?.filter((_, i) => i !== index)
    }));
  };

  const updateEmploymentRecord = (index: number, field: keyof EmploymentRecord, value: string) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory?.map((record, i) => 
        i === index ? { ...record, [field]: value } : record
      )
    }));
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...(prev.references || []), { name: '', relationship: '', email: '', contact: '' }]
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.map((record, i) => 
        i === index ? { ...record, [field]: value } : record
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.programme) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Check if agentId and agentName are available
      console.log('Agent ID from props:', agentId);
      console.log('Agent Name from props:', agentName);
      console.log('Current formData:', formData);

      // Ensure agent_id and agent_name are included
      const submissionData = {
        ...formData,
        agent_id: agentId,
        agent_name: agentName,
        company_name: company_name 
      };

      console.log('Submitting application data with agent info:', submissionData);
      console.log('Verification - agent_id in submissionData:', submissionData.agent_id);
      console.log('Verification - agent_name in submissionData:', submissionData.agent_name);
      // return; // Remove this line to enable submission==================================

      // Submit application with files
      await createApplication(submissionData, uploadedFiles);
      setNotification({type: 'success', message: 'Application submitted successfully! The application has been synced to the main admissions database.', duration: 3000});
      // alert('Application submitted successfully! The application has been synced to the main admissions database.');
      onSuccess();
    } catch (error) {
      alert('Error submitting application: ' + (error instanceof Error ? JSON.stringify(error.message) : 'Please try again.'));
      console.error(error);
    } finally {
      setLoading(false);    
    }
  };

  const sections = [
    'Personal Information',
    'Course Selection',
    'Academic History',
    'English Language',
    'Employment History',
    'References',
    'Funding & Scholarships',
    'Additional Information',
    'Documents'
  ];

  return (
    <div className="application-form-container">
      {/* Progress Indicator */}
       {notification && <Notification {...notification} />}
      <div className="progress-bar">
        {sections.map((section, index) => (
          <div 
            key={index}
            className={`progress-step ${currentSection === index + 1 ? 'active' : ''} ${currentSection > index + 1 ? 'completed' : ''}`}
            onClick={() => setCurrentSection(index + 1)}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{section}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        {/* Section 1: Personal Information */}
        {currentSection === 1 && (
          <div className="form-section">
            <h3 className="section-title">👤 Section 1: Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <select name="title" value={formData.title || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input className = "text-black  " type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Middle Name(s)</label>
                <input className = "text-black  "  type="text" name="middleName" value={formData.middleName || ''} onChange={handleChange} />
              </div>
          
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="dateOfBirth" placeholder="DD/MM/YYYY" value={formData.dateOfBirth || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select name="gender" value={formData.gender || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nationality <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Country of Residence <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="countryOfResidence" value={formData.countryOfResidence || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Passport Number <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="passportNumber" value={formData.passportNumber || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>National Insurance Number</label>
                <input className = "text-black  "  type="text" name="niNumber" value={formData.niNumber || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input className = "text-black  "  type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Contact Number <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Current Address <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="currentAddress" value={formData.currentAddress || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="city" value={formData.city || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Postcode <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="postcode" value={formData.postcode || ''} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Country <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="country" value={formData.country || ''} onChange={handleChange} required />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Course Selection */}
        {currentSection === 2 && (
          <div className="form-section">
            <h3 className="section-title">📚 Section 2: Course Selection</h3>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Programme/Course Applied For <span className="required">*</span></label>
                <input className = "text-black  "   type="text" name="programme" value={formData.programme || ''} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mode of Study <span className="required">*</span></label>
                <select className = "text-black  "  name="modeOfStudy" value={formData.modeOfStudy || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="form-group">
                <label>Level of Study <span className="required">*</span></label>
                <select className = "text-black  "  name="levelOfStudy" value={formData.levelOfStudy || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Month <span className="required">*</span></label>
                <select className = "text-black  "  name="startMonth" value={formData.startMonth || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div className="form-group">
                <label>Start Year <span className="required">*</span></label>
                <select className = "text-black  "  name="startYear" value={formData.startYear || ''} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <div className="form-group">
                <label>Campus Preference <span className="required">*</span></label>
                <input className = "text-black  "  type="text" name="campusPreference" value={formData.campusPreference || ''} onChange={handleChange} required />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Academic History */}
        {currentSection === 3 && (
          <div className="form-section">
            <h3 className="section-title">🎓 Section 3: Academic History</h3>
            
            {formData.academicHistory?.map((record, index) => (
              <div key={index} className="repeatable-item">
                <div className="repeatable-header">
                  <h4>Academic Qualification {index + 1}</h4>
                  {index > 0 && (
                    <button type="button" className="btn-remove" onClick={() => removeAcademicRecord(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Qualification</label>
                    <input 
                      type="text" 
                      className = "text-black  "  
                      value={record.qualification} 
                      onChange={(e) => updateAcademicRecord(index, 'qualification', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Institution</label>
                    <input 
                      type="text" 
                      value={record.institution} 
                      onChange={(e) => updateAcademicRecord(index, 'institution', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input 
                      type="text" 
                      value={record.country} 
                      onChange={(e) => updateAcademicRecord(index, 'country', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date From</label>
                    <input 
                      type="text" 
                      placeholder="YYYY" 
                      value={record.dateFrom} 
                      onChange={(e) => updateAcademicRecord(index, 'dateFrom', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date To</label>
                    <input 
                      type="text" 
                      placeholder="YYYY" 
                      value={record.dateTo} 
                      onChange={(e) => updateAcademicRecord(index, 'dateTo', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Grade/Result</label>
                    <input 
                      type="text" 
                      value={record.grade} 
                      onChange={(e) => updateAcademicRecord(index, 'grade', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={addAcademicRecord}>
              ➕ Add Another Qualification
            </button>
          </div>
        )}

        {/* Section 4: English Language Proficiency */}
        {currentSection === 4 && (
          <div className="form-section">
            <h3 className="section-title">🗣️ Section 4: English Language Proficiency</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>English Qualification</label>
                <select name="englishQualification" value={formData.englishQualification || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="PTE">PTE Academic</option>
                  <option value="Cambridge">Cambridge English</option>
                  <option value="Native Speaker">Native Speaker</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Overall Score</label>
                <input type="text" name="englishOverall" value={formData.englishOverall || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Date Taken</label>
                <input type="text" name="englishDate" placeholder="DD/MM/YYYY" value={formData.englishDate || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Reading</label>
                <input type="text" name="englishReading" value={formData.englishReading || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Writing</label>
                <input type="text" name="englishWriting" value={formData.englishWriting || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Speaking</label>
                <input type="text" name="englishSpeaking" value={formData.englishSpeaking || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Listening</label>
                <input type="text" name="englishListening" value={formData.englishListening || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Employment History */}
        {currentSection === 5 && (
          <div className="form-section">
            <h3 className="section-title">💼 Section 5: Employment History</h3>
            
            {formData.employmentHistory && formData.employmentHistory.length > 0 ? (
              formData.employmentHistory.map((record, index) => (
                <div key={index} className="repeatable-item">
                  <div className="repeatable-header">
                    <h4>Employment {index + 1}</h4>
                    <button type="button" className="btn-remove" onClick={() => removeEmploymentRecord(index)}>
                      ✕ Remove
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Position</label>
                      <input 
                        type="text" 
                        value={record.position} 
                        onChange={(e) => updateEmploymentRecord(index, 'position', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Employer</label>
                      <input 
                        type="text" 
                        value={record.employer} 
                        onChange={(e) => updateEmploymentRecord(index, 'employer', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Country</label>
                      <input 
                        type="text" 
                        value={record.country} 
                        onChange={(e) => updateEmploymentRecord(index, 'country', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>From</label>
                      <input 
                        type="text" 
                        placeholder="YYYY" 
                        value={record.dateFrom} 
                        onChange={(e) => updateEmploymentRecord(index, 'dateFrom', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>To</label>
                      <input 
                        type="text" 
                        placeholder="YYYY or Present" 
                        value={record.dateTo} 
                        onChange={(e) => updateEmploymentRecord(index, 'dateTo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Responsibilities</label>
                      <textarea 
                        value={record.responsibilities} 
                        onChange={(e) => updateEmploymentRecord(index, 'responsibilities', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-records">No employment history added. Click below to add.</p>
            )}

            <button type="button" className="btn-add" onClick={addEmploymentRecord}>
              ➕ Add Employment Record
            </button>
          </div>
        )}

        {/* Section 6: References */}
        {currentSection === 6 && (
          <div className="form-section">
            <h3 className="section-title">📧 Section 6: References</h3>
            
            {formData.references?.map((record, index) => (
              <div key={index} className="repeatable-item">
                <div className="repeatable-header">
                  <h4>Reference {index + 1}</h4>
                  {index > 0 && (
                    <button type="button" className="btn-remove" onClick={() => removeReference(index)}>
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      value={record.name} 
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Relationship</label>
                    <input 
                      type="text" 
                      value={record.relationship} 
                      onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={record.email} 
                      onChange={(e) => updateReference(index, 'email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input 
                      type="text" 
                      value={record.contact} 
                      onChange={(e) => updateReference(index, 'contact', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={addReference}>
              ➕ Add Another Reference
            </button>
          </div>
        )}

        {/* Section 7: Funding & Scholarships */}
        {currentSection === 7 && (
          <div className="form-section">
            <h3 className="section-title">💰 Section 7: Funding & Scholarships</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tuition Fees Funded By</label>
                <select name="funding" value={formData.funding || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Self-funded">Self-funded</option>
                  <option value="Student Finance">Student Finance</option>
                  <option value="Company Sponsored">Company Sponsored</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Apply for Scholarship</label>
                <select name="applyScholarship" value={formData.applyScholarship || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Scholarship Name (if applicable)</label>
                <input type="text" name="scholarshipName" value={formData.scholarshipName || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Student Finance CRN Number</label>
                <input type="text" name="studentFinanceCRN" value={formData.studentFinanceCRN || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {/* Section 8: Additional Information */}
        {currentSection === 8 && (
          <div className="form-section">
            <h3 className="section-title">ℹ️ Section 8: Additional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Disability/Learning Support Required</label>
                <select name="disability" value={formData.disability || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label>Criminal Conviction</label>
                <select name="criminalConviction" value={formData.criminalConviction || ''} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {formData.disability === 'Yes' && (
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Please provide details</label>
                  <textarea name="disabilityDetails" value={formData.disabilityDetails || ''} onChange={handleChange} rows={3} />
                </div>
              </div>
            )}

            {formData.criminalConviction === 'Yes' && (
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Please provide details</label>
                  <textarea name="convictionDetails" value={formData.convictionDetails || ''} onChange={handleChange} rows={3} />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group full-width">
                <label>Additional Information</label>
                <textarea name="additionalInfo" value={formData.additionalInfo || ''} onChange={handleChange} rows={4} />
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Documents */}
        {currentSection === 9 && (
          <div className="form-section">
            <h3 className="section-title">📎 Section 9: Document Upload</h3>
            
            <div className="info-box">
              <p><strong>Required Documents:</strong></p>
              <ul>
                <li>Valid Passport</li>
                <li>Academic Certificates & Transcripts</li>
                <li>English Language Test Results (if applicable)</li>
                <li>Personal Statement</li>
                <li>Reference Letters</li>
              </ul>
            </div>

            <div className="form-group">
              <label>Upload Documents</label>
              <input 
                type="file" 
                multiple 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                onChange={handleFileChange}
              />
              <p className="help-text">Maximum file size: 10MB per file. Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-list">
                <h4 style={{ marginBottom: '1rem', color: '#1a202c' }}>Uploaded Files ({uploadedFiles.length})</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="uploaded-file-item">
                    <div className="file-info">
                      <span className="file-name">📄 {file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-remove-file" 
                      onClick={() => removeFile(index)}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentSection > 1 && (
            <button type="button" className="btn-prev" onClick={() => setCurrentSection(currentSection - 1)}>
              ← Previous
            </button>
          )}
          
          {currentSection < 9 && (
            <button type="button" className="btn-next" onClick={() => setCurrentSection(currentSection + 1)}>
              Next →
            </button>
          )}
          
          {currentSection === 9 && (
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : '✓ Submit Application'}
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        .application-form-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Progress Bar */
        .progress-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding: 1rem 0;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          min-width: 100px;
          transition: all 0.3s;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.3s;
        }

        .progress-step.active .step-number {
          background: #0052a3;
          color: white;
          transform: scale(1.1);
        }

        .progress-step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
        }

        .progress-step.active .step-label {
          color: #0052a3;
          font-weight: 600;
        }

        /* Form Styling */
        .application-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .form-section {
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-title {
          font-size: 1.5rem;
          color: #1a202c;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .required {
          color: #ef4444;
        }

        input[type="text"],
        input[type="email"],
        select,
        textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s;
          color: #1a202c;
          background: white;
        }

        input[type="text"]::placeholder,
        input[type="email"]::placeholder,
        textarea::placeholder {
          color: #94a3b8;
          opacity: 1;
        }

        select {
          color: #1a202c;
          appearance: auto;
        }

        select option {
          color: #1a202c;
          background: white;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #0052a3;
          box-shadow: 0 0 0 3px rgba(0, 82, 163, 0.1);
          color: #1a202c;
        }

        textarea {
          resize: vertical;
        }

        input[type="file"] {
          padding: 0.75rem;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          cursor: pointer;
        }

        .help-text {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        /* Repeatable Items */
        .repeatable-item {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border: 2px solid #e2e8f0;
        }

        .repeatable-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .repeatable-header h4 {
          margin: 0;
          color: #1a202c;
          font-size: 1.1rem;
        }

        .btn-remove {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          width: 100%;
          padding: 1rem;
          background: #e0f2fe;
          color: #075985;
          border: 2px dashed #0284c7;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add:hover {
          background: #bae6fd;
        }

        .no-records {
          text-align: center;
          padding: 2rem;
          color: #64748b;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        /* Info Box */
        .info-box {
          background: #dbeafe;
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .info-box p {
          margin: 0.5rem 0;
          color: #1e3a8a;
        }

        .info-box ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          color: #1e3a8a;
        }

        /* Uploaded Files List */
        .uploaded-files-list {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .uploaded-file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid #e2e8f0;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-name {
          font-weight: 600;
          color: #1a202c;
          font-size: 0.95rem;
        }

        .file-size {
          font-size: 0.85rem;
          color: #64748b;
        }

        .btn-remove-file {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-remove-file:hover {
          background: #fecaca;
        }

        /* Navigation Buttons */
        .form-navigation {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }

        .btn-prev,
        .btn-next,
        .btn-submit {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
        }

        .btn-prev {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-prev:hover {
          background: #e2e8f0;
        }

        .btn-next {
          background: #0052a3;
          color: white;
        }

        .btn-next:hover {
          background: #003d7a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 82, 163, 0.3);
        }

        .btn-submit {
          background: #10b981;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .application-form {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .progress-bar {
            flex-wrap: nowrap;
            justify-content: flex-start;
          }

          .step-label {
            display: none;
          }

          .form-navigation {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
