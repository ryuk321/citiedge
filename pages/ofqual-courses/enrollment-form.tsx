"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * ========================================
 * OFQUAL LEARNER APPLICATION & ENROLLMENT FORM
 * ========================================
 * This form collects all necessary information for OTHM/QUALIFI course enrollment
 * Complies with GDPR and Ofqual requirements
 */

// Form data structure - Easy to edit
interface EnrollmentFormData {
  // Section 1: Personal Details
  fullLegalName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  uln: string;
  address: string;
  postcode: string;
  email: string;
  telephone: string;
  
  // Section 2: Identification
  idType: string;
  rightToStudyUK: string;
  
  // Section 3: Qualification Details
  qualificationTitle: string;
  qualificationLevel: string;
  awardingOrganisation: string;
  modeOfStudy: string;
  proposedStartDate: string;
  
  // Section 4: Entry Requirements
  highestQualification: string;
  relevantWorkExperience: string;
  englishProficiency: string;
  ieltsScore: string;
  
  // Section 5: Equality & Diversity
  hasDisability: string;
  disabilityDetails: string;
  ethnicOrigin: string;
  
  // Section 6: Reasonable Adjustments
  requiresAdjustments: string;
  adjustmentDetails: string;
  consentToShare: boolean;
  
  // Section 7: Data Protection
  readPrivacyNotice: boolean;
  consentDataProcessing: boolean;
  
  // Section 8: Learner Declaration
  agreeToPolicies: boolean;
}

export default function EnrollmentForm() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');

  // Initialize form data
  const [formData, setFormData] = useState<EnrollmentFormData>({
    fullLegalName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    uln: '',
    address: '',
    postcode: '',
    email: '',
    telephone: '',
    idType: '',
    rightToStudyUK: '',
    qualificationTitle: '',
    qualificationLevel: '',
    awardingOrganisation: '',
    modeOfStudy: '',
    proposedStartDate: '',
    highestQualification: '',
    relevantWorkExperience: '',
    englishProficiency: '',
    ieltsScore: '',
    hasDisability: 'No',
    disabilityDetails: '',
    ethnicOrigin: '',
    requiresAdjustments: 'No',
    adjustmentDetails: '',
    consentToShare: false,
    readPrivacyNotice: false,
    consentDataProcessing: false,
    agreeToPolicies: false,
  });

  // Pre-fill category from URL if coming from overview page
  useEffect(() => {
    const category = router.query.category as string;
    if (category) {
      setFormData(prev => ({ ...prev, qualificationTitle: category }));
    }
  }, [router.query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validate current section
  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(formData.fullLegalName && formData.dateOfBirth && formData.email && formData.telephone);
      case 2:
        return !!(formData.idType);
      case 3:
        return !!(formData.qualificationTitle && formData.qualificationLevel && formData.awardingOrganisation && formData.modeOfStudy);
      case 4:
        return !!(formData.highestQualification);
      case 7:
        return formData.readPrivacyNotice && formData.consentDataProcessing;
      case 8:
        return formData.agreeToPolicies;
      default:
        return true;
    }
  };

  // Navigate sections
  const goToNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 8) {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      alert('Please fill in all required fields before continuing.');
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSection(8)) {
      alert('Please complete all required fields and agree to the policies.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('');

    try {
      const response = await fetch('/api/ofqual/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Application submitted successfully! You will receive a confirmation email shortly.');
        
        // Redirect to thank you page after 3 seconds
        setTimeout(() => {
          router.push('/ofqual-courses/thank-you');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit application. Please try again later.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section titles
  const sectionTitles = [
    "Personal Details",
    "Identification & Eligibility",
    "Qualification Details",
    "Entry Requirements & Prior Learning",
    "Equality & Diversity Monitoring",
    "Reasonable Adjustments",
    "Data Protection & GDPR Consent",
    "Learner Declaration"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/ofqual-courses/overview"
            className="inline-block text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Course Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Learner Application & Enrollment Form
          </h1>
          <p className="text-lg text-gray-600">
            OTHM / QUALIFI Regulated Qualifications – Ofqual Regulated
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">
              Section {currentSection} of 8: {sectionTitles[currentSection - 1]}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentSection / 8) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Personal Details */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 1: Learner Personal Details
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Legal Name (as per ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullLegalName"
                    value={formData.fullLegalName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black "
                    placeholder="Enter your full legal name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender (optional)
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="e.g., British, American"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Unique Learner Number (ULN) (if known)
                    </label>
                    <input
                      type="text"
                      name="uln"
                      value={formData.uln}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Street address, city, country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Postcode
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="e.g., SW1A 1AA"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telephone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="+44 1234 567890"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Identification & Eligibility */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 2: Identification & Eligibility
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Do you hold valid photo identification? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {['Passport', 'Driving Licence', 'National ID Card', 'Other'].map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="idType"
                          value={option}
                          checked={formData.idType === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Right to Study in the UK (if applicable)
                  </label>
                  <div className="space-y-2">
                    {['Yes', 'No', 'Not applicable (overseas learner)'].map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="rightToStudyUK"
                          value={option}
                          checked={formData.rightToStudyUK === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Evidence will be requested where required
                  </p>
                </div>
              </div>
            )}

            {/* Section 3: Qualification Details */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 3: Qualification Details
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qualification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualificationTitle"
                    value={formData.qualificationTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="e.g., Business and Management"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qualification Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'].map(level => (
                      <label key={level} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="qualificationLevel"
                          value={level}
                          checked={formData.qualificationLevel === level}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Awarding Organisation <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {['OTHM', 'QUALIFI'].map(org => (
                      <label key={org} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="awardingOrganisation"
                          value={org}
                          checked={formData.awardingOrganisation === org}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{org}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mode of Study <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Classroom', 'Online', 'Blended', 'Distance Learning'].map(mode => (
                      <label key={mode} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="modeOfStudy"
                          value={mode}
                          checked={formData.modeOfStudy === mode}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Proposed Start Date
                  </label>
                  <input
                    type="date"
                    name="proposedStartDate"
                    value={formData.proposedStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
            )}

            {/* Section 4: Entry Requirements */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 4: Entry Requirements & Prior Learning
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Highest Academic Qualification Achieved <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="e.g., Bachelor's Degree in Business"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Relevant Work Experience (if any)
                  </label>
                  <textarea
                    name="relevantWorkExperience"
                    value={formData.relevantWorkExperience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Describe your relevant work experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    English Language Proficiency (if applicable)
                  </label>
                  <div className="space-y-2">
                    {['Native speaker', 'IELTS', 'Other evidence'].map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="englishProficiency"
                          value={option}
                          checked={formData.englishProficiency === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.englishProficiency === 'IELTS' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      IELTS Score
                    </label>
                    <input
                      type="text"
                      name="ieltsScore"
                      value={formData.ieltsScore}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="e.g., 6.5"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Section 5: Equality & Diversity */}
            {currentSection === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 5: Equality & Diversity Monitoring
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Optional:</strong> This information is used only for monitoring and quality assurance purposes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Do you consider yourself to have a disability, learning difficulty, or health condition?
                  </label>
                  <div className="space-y-2">
                    {['Yes', 'No', 'Prefer not to say'].map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="hasDisability"
                          value={option}
                          checked={formData.hasDisability === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.hasDisability === 'Yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If yes, please specify (optional)
                    </label>
                    <textarea
                      name="disabilityDetails"
                      value={formData.disabilityDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ethnic Origin (optional)
                  </label>
                  <select
                    name="ethnicOrigin"
                    value={formData.ethnicOrigin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">Select...</option>
                    <option value="White">White</option>
                    <option value="Asian">Asian</option>
                    <option value="Black">Black</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}

            {/* Section 6: Reasonable Adjustments */}
            {currentSection === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 6: Reasonable Adjustments & Special Consideration
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    OTHM & QUALIFI Requirement – Condition C
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Do you require reasonable adjustments or additional support for assessments?
                  </label>
                  <div className="space-y-2">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="requiresAdjustments"
                          value={option}
                          checked={formData.requiresAdjustments === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.requiresAdjustments === 'Yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      If yes, please provide details and supporting evidence if available
                    </label>
                    <textarea
                      name="adjustmentDetails"
                      value={formData.adjustmentDetails}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="consentToShare"
                    checked={formData.consentToShare}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <label className="text-gray-700">
                    I consent to the centre sharing relevant information with the awarding organisation for the purpose of arranging reasonable adjustments or special consideration
                  </label>
                </div>
              </div>
            )}

            {/* Section 7: Data Protection */}
            {currentSection === 7 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 7: Data Protection & GDPR Consent
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    UK GDPR & Ofqual Condition A
                  </p>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    The centre will process your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                  </p>
                  
                  <p className="text-gray-700 font-semibold mb-2">Your data may be shared with:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>The awarding organisation (OTHM / QUALIFI)</li>
                    <li>Ofqual and other regulatory authorities where required</li>
                    <li>External Quality Assurers (EQA)</li>
                  </ul>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="readPrivacyNotice"
                      checked={formData.readPrivacyNotice}
                      onChange={handleInputChange}
                      required
                      className="w-5 h-5 text-blue-600 mt-1"
                    />
                    <label className="text-gray-700">
                      I confirm that I have read and understood the Privacy Notice <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="consentDataProcessing"
                      checked={formData.consentDataProcessing}
                      onChange={handleInputChange}
                      required
                      className="w-5 h-5 text-blue-600 mt-1"
                    />
                    <label className="text-gray-700">
                      I consent to the processing and sharing of my data as outlined above <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Section 8: Learner Declaration */}
            {currentSection === 8 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                  Section 8: Learner Declaration
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Required by OTHM & QUALIFI
                  </p>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 font-semibold mb-3">I confirm that:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>The information provided in this form is true and accurate</li>
                    <li>I meet the entry requirements for the qualification</li>
                    <li>I agree to comply with the centre's:
                      <ul className="list-circle pl-6 mt-1 space-y-1">
                        <li>Academic Integrity & Malpractice Policy</li>
                        <li>Complaints & Appeals Policy</li>
                        <li>Equality & Diversity Policy</li>
                        <li>Assessment & Internal Quality Assurance procedures</li>
                      </ul>
                    </li>
                    <li>I understand that false information may result in withdrawal from the programme</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-3 mt-6">
                  <input
                    type="checkbox"
                    name="agreeToPolicies"
                    checked={formData.agreeToPolicies}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-blue-600 mt-1"
                  />
                  <label className="text-gray-700 font-semibold">
                    I agree to all the above statements and declarations <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-600">
                    By submitting this form, you are providing your electronic signature and consent to the above declarations.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Message */}
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg ${
                submitStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={currentSection === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  currentSection === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Previous
              </button>

              {currentSection < 8 ? (
                <button
                  type="button"
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:admissions@citiedge.edu" className="text-blue-600 hover:text-blue-700 underline">
              admissions@citiedge.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
