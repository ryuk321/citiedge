/**
 * Agent Data Types and Dummy Data
 * 
 * Defines TypeScript interfaces for agent-related data
 * Provides dummy data for development (easy to swap with real API later)
 */

export interface Agent {
  // Primary Key
  id?: number;
  
  // Agent Identification
  agent_id: string;
  agent_code?: string;
  
  // Company/Organization Information
  company_name: string;
  company_registration_number?: string;
  company_type?: "individual" | "agency" | "institution" | "partner";
  
  // Contact Person Details
  contact_person_title?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
  contact_person_first_name: string;
  contact_person_last_name: string;
  contact_person_position?: string;
  
  // Contact Information
  email: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string;
  
  // Address Information
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country: string;
  
  // Business Details
  website?: string;
  operating_countries?: string;
  specialization?: string;
  years_in_business?: number;
  
  // Commission & Financial
  commission_rate?: number;
  payment_method?: "bank_transfer" | "paypal" | "stripe" | "check" | "other";
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_swift_code?: string;
  tax_id_number?: string;
  
  // Agreement & Legal
  contract_start_date?: string;
  contract_end_date?: string;
  contract_status?: "active" | "expired" | "terminated" | "pending";
  agreement_document_url?: string;
  
  // Performance Metrics
  total_applications?: number;
  successful_enrollments?: number;
  pending_applications?: number;
  rejected_applications?: number;
  conversion_rate?: number;
  
  // Login & Security
  password_hash?: string;
  last_login?: string;
  login_attempts?: number;
  account_locked?: boolean;
  
  // Status & Settings
  status?: "active" | "inactive" | "suspended" | "pending_approval";
  verification_status?: "verified" | "unverified" | "under_review";
  email_verified?: boolean;
  phone_verified?: boolean;
  
  // Permissions & Access
  portal_access?: boolean;
  can_submit_applications?: boolean;
  can_view_commission?: boolean;
  requires_admin_approval?: boolean;
  
  // Notifications & Preferences
  notification_email?: boolean;
  notification_sms?: boolean;
  notification_whatsapp?: boolean;
  preferred_language?: string;
  timezone?: string;
  
  // Supporting Documents
  business_license_url?: string;
  identity_document_url?: string;
  proof_of_address_url?: string;
  reference_letter_url?: string;
  
  // Notes & Remarks
  admin_notes?: string;
  agent_notes?: string;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface AgentApplication {
  // Primary Key
  id?: number;
  
  // Link to agent (snake_case to match database)
  agent_id: string;
  agent_name: string;
  
  // Application Details (snake_case to match database)
  application_id?: string;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  student_phone?: string;
  
  // Course Information (snake_case to match database)
  programme: string;
  course_level?: string;
  intake?: string;
  start_date?: string; // DATE format: YYYY-MM-DD
  
  // Application Status (snake_case to match database)
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'enrolled' | 'withdrawn';
  submission_date?: string; // DATETIME
  review_date?: string; // DATETIME
  decision_date?: string; // DATETIME
  
  // Commission (snake_case to match database)
  tuition_fee?: number; // DECIMAL(10,2)
  commission_amount?: number; // DECIMAL(10,2)
  commission_status?: 'pending' | 'approved' | 'paid' | 'cancelled';
  commission_paid_date?: string; // DATE
  
  // Application Data (snake_case to match database)
  application_data?: any; // JSON - stores complete form data
  documents_uploaded?: number;
  
  // Notes (snake_case to match database)
  admin_notes?: string;
  agent_notes?: string;
  rejection_reason?: string;
  
  // Metadata (snake_case to match database)
  created_at?: string; // TIMESTAMP
  updated_at?: string; // TIMESTAMP
  
  // Additional frontend fields (camelCase for form compatibility)
  // These will be stored in application_data JSON field
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  countryOfResidence?: string;
  passportNumber?: string;
  niNumber?: string;
  email?: string;
  contactNumber?: string;
  currentAddress?: string;
  city?: string;
  postcode?: string;
  country?: string;
  modeOfStudy?: string;
  levelOfStudy?: string;
  startMonth?: string;
  startYear?: string;
  campusPreference?: string;
  academicHistory?: AcademicRecord[];
  englishQualification?: string;
  englishOverall?: string;
  englishReading?: string;
  englishWriting?: string;
  englishSpeaking?: string;
  englishListening?: string;
  englishDate?: string;
  employmentHistory?: EmploymentRecord[];
  references?: Reference[];
  funding?: string;
  applyScholarship?: string;
  scholarshipName?: string;
  studentFinanceCRN?: string;
  disability?: string;
  disabilityDetails?: string;
  criminalConviction?: string;
  convictionDetails?: string;
  additionalInfo?: string;
  documents?: ApplicationDocument[];
  
  // Legacy compatibility
  submissionDate?: string;
  lastUpdated?: string;
  notes?: string;
}

export interface AcademicRecord {
  qualification: string;
  institution: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  grade: string;
}

export interface EmploymentRecord {
  position: string;
  employer: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  responsibilities: string;
}

export interface Reference {
  name: string;
  relationship: string;
  email: string;
  contact: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  size: number;
}

export interface AgentNotification {
  id?: number | string;
  agent_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'application_update' | 'commission' | 'system';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  date?: string;
  created_at?: string;
  read: boolean;
  is_read?: boolean;
  read_at?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  action_label?: string;
  expires_at?: string;
}

// ========================================
// API CONFIGURATION
// ========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ========================================
// DATA FETCHING FUNCTIONS
// ========================================

// Keep dummy data for reference (not exported)
// const dummyApplications: AgentApplication[] = [
//   {
//     id: 'APP-2024-001',
//     agentId: 'AGT-2024-001',
//     agentName: 'John Smith',
//     title: 'Mr',
//     firstName: 'James',
//     middleName: 'Robert',
//     lastName: 'Wilson',
//     dateOfBirth: '15/03/2000',
//     gender: 'Male',
//     nationality: 'British',
//     countryOfResidence: 'United Kingdom',
//     passportNumber: 'GB123456789',
//     niNumber: 'AB123456C',
//     email: 'james.wilson@email.com',
//     contactNumber: '+44 7987 654321',
//     currentAddress: '123 High Street',
//     city: 'London',
//     postcode: 'SW1A 1AA',
//     country: 'United Kingdom',
//     programme: 'BSc Computer Science',
//     modeOfStudy: 'Full-time',
//     levelOfStudy: 'Undergraduate',
//     startMonth: 'September',
//     startYear: '2024',
//     campusPreference: 'Main Campus',
//     academicHistory: [
//       {
//         qualification: 'A-Levels',
//         institution: 'London High School',
//         country: 'United Kingdom',
//         dateFrom: '2018',
//         dateTo: '2020',
//         grade: 'AAB'
//       }
//     ],
//     englishQualification: 'IELTS',
//     englishOverall: '7.0',
//     englishReading: '7.5',
//     englishWriting: '6.5',
//     englishSpeaking: '7.0',
//     englishListening: '7.0',
//     englishDate: '15/01/2024',
//     employmentHistory: [],
//     references: [
//       {
//         name: 'Dr. Sarah Johnson',
//         relationship: 'Teacher',
//         email: 'sarah.j@school.com',
//         contact: '+44 7111 222333'
//       }
//     ],
//     funding: 'Self-funded',
//     applyScholarship: 'No',
//     scholarshipName: '',
//     studentFinanceCRN: '',
//     disability: 'No',
//     disabilityDetails: '',
//     criminalConviction: 'No',
//     convictionDetails: '',
//     additionalInfo: '',
//     documents: [
//       {
//         id: 'DOC-001',
//         name: 'passport.pdf',
//         type: 'Passport',
//         url: '/uploads/passport.pdf',
//         uploadDate: '2024-01-20',
//         size: 1024000
//       }
//     ],
//     status: 'pending',
//     submissionDate: '2024-01-20',
//     lastUpdated: '2024-01-20',
//     notes: ''
//   },
//   {
//     id: 'APP-2024-002',
//     agentId: 'AGT-2024-001',
//     agentName: 'John Smith',
//     title: 'Ms',
//     firstName: 'Emma',
//     middleName: 'Jane',
//     lastName: 'Thompson',
//     dateOfBirth: '22/07/1999',
//     gender: 'Female',
//     nationality: 'British',
//     countryOfResidence: 'United Kingdom',
//     passportNumber: 'GB987654321',
//     niNumber: 'CD789012E',
//     email: 'emma.thompson@email.com',
//     contactNumber: '+44 7888 999000',
//     currentAddress: '45 Park Avenue',
//     city: 'Manchester',
//     postcode: 'M1 1AA',
//     country: 'United Kingdom',
//     programme: 'MBA Business Administration',
//     modeOfStudy: 'Full-time',
//     levelOfStudy: 'Postgraduate',
//     startMonth: 'January',
//     startYear: '2025',
//     campusPreference: 'Main Campus',
//     academicHistory: [
//       {
//         qualification: 'BSc Business Management',
//         institution: 'Manchester University',
//         country: 'United Kingdom',
//         dateFrom: '2017',
//         dateTo: '2020',
//         grade: 'First Class'
//       }
//     ],
//     englishQualification: 'Native Speaker',
//     englishOverall: '',
//     englishReading: '',
//     englishWriting: '',
//     englishSpeaking: '',
//     englishListening: '',
//     englishDate: '',
//     employmentHistory: [
//       {
//         position: 'Marketing Manager',
//         employer: 'Tech Solutions Ltd',
//         country: 'United Kingdom',
//         dateFrom: '2020',
//         dateTo: 'Present',
//         responsibilities: 'Managing marketing campaigns and team coordination'
//       }
//     ],
//     references: [
//       {
//         name: 'Mr. David Brown',
//         relationship: 'Line Manager',
//         email: 'david.b@techsolutions.com',
//         contact: '+44 7222 333444'
//       }
//     ],
//     funding: 'Company Sponsored',
//     applyScholarship: 'Yes',
//     scholarshipName: 'Excellence Scholarship',
//     studentFinanceCRN: '',
//     disability: 'No',
//     disabilityDetails: '',
//     criminalConviction: 'No',
//     convictionDetails: '',
//     additionalInfo: 'Looking to enhance leadership skills',
//     documents: [
//       {
//         id: 'DOC-002',
//         name: 'degree_certificate.pdf',
//         type: 'Degree Certificate',
//         url: '/uploads/degree.pdf',
//         uploadDate: '2024-01-21',
//         size: 2048000
//       }
//     ],
//     status: 'approved',
//     submissionDate: '2024-01-21',
//     lastUpdated: '2024-01-25',
//     notes: 'Strong candidate, approved for scholarship'
//   }
// ];

// export const dummyNotifications: AgentNotification[] = [
//   {
//     id: 'NOT-001',
//     title: 'Application Approved',
//     message: 'Application APP-2024-002 has been approved',
//     type: 'success',
//     date: '2024-01-25',
//     read: false
//   },
//   {
//     id: 'NOT-002',
//     title: 'Document Required',
//     message: 'APP-2024-001 requires additional documentation',
//     type: 'warning',
//     date: '2024-01-24',
//     read: false
//   },
//   {
//     id: 'NOT-003',
//     title: 'Welcome to Agent Portal',
//     message: 'Your agent account has been activated',
//     type: 'info',
//     date: '2024-01-15',
//     read: true
//   }
// ];

export async function fetchAgentProfile(agentId: string): Promise<Agent> {
  try {
    const response = await fetch(`/api/agent/profile?id=${agentId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch agent profile: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch agent profile');
    }
    
    return data.agent;
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    throw error;
  }
}

export async function fetchAgentApplications(agentId: string): Promise<AgentApplication[]> {
  try {
    const response = await fetch(`/api/agent/applications?agent_id=${agentId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch agent applications: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch agent applications');
    }
    
    return data.applications || [];
  } catch (error) {
    console.error('Error fetching agent applications:', error);
    throw error;
  }
}

export async function fetchAgentNotifications(agentId: string): Promise<AgentNotification[]> {
  try {
    const response = await fetch(`/api/agent/notifications?agent_id=${agentId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch agent notifications: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch agent notifications');
    }
    
    // Map database fields to interface fields
    const notifications = (data.notifications || []).map((notif: any) => ({
      ...notif,
      read: notif.is_read || notif.read || false,
      date: notif.created_at || notif.date
    }));
    
    return notifications;
  } catch (error) {
    console.error('Error fetching agent notifications:', error);
    throw error;
  }
}

// Helper function to upload files to admissions subdomain
async function uploadFiles(files: File[], studentInfo: { firstName: string; lastName: string; passportNumber: string }) {
  const formData = new FormData();
  
  formData.append('firstName', studentInfo.firstName);
  formData.append('lastName', studentInfo.lastName);
  formData.append('passportNumber', studentInfo.passportNumber);
  
  files.forEach(file => {
    formData.append('files[]', file);
  });

  const response = await fetch(
    'https://admissions.citiedgecollege.co.uk/api/upload-files.php',
    { method: 'POST', body: formData }
  );

  console.log('Upload response status:', response.status);
  const responseText = await response.text();
  console.log('Upload response body:', responseText);

  if (!response.ok) {
    throw new Error(`File upload failed (${response.status}): ${responseText.substring(0, 200)}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (parseError) {
    throw new Error(`Invalid JSON from upload server: ${responseText.substring(0, 200)}`);
  }
}

export async function createApplication(data: Partial<AgentApplication>, files?: File[]): Promise<AgentApplication> {
  console.log('createApplication called with:', { data, filesCount: files?.length || 0 });
  try {
    
    //STEP 1: Submit application data as JSON (without files)

    console.log('Step 1: Submitting application data...');
    const response = await fetch('/api/agent/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Raw response from agent_api.php:');
    console.log(responseText.substring(0, 500));
    console.log('---END OF RESPONSE---');
    
    if (!response.ok) {
      console.error('❌ ERROR RESPONSE FROM SERVER:');
      console.error('Status:', response.status, response.statusText);
      console.error('Response body:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('Parsed error:', errorData);
        const errorMessage = errorData.error || errorData.message || `Failed to create application: ${response.status}`;
        console.error('Final error message:', errorMessage);
        throw new Error(errorMessage);
      } catch (parseError) {
        console.error('Could not parse error response as JSON');
        throw new Error(`Failed to create application: ${response.status} - ${responseText.substring(0, 200)}`);
      }
    }
    
    try {
      const result = JSON.parse(responseText);
      console.log('✅ Application created:', result);
      if (!result.success) {
        console.error('Result indicates failure:', result);
        throw new Error(result.error || result.message || 'Failed to create application');
      }
    } catch (jsonParseError) {
      console.error('❌ Response is not valid JSON');
      console.error('Parse error:', jsonParseError);
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);}
    


    // STEP 2: Upload files separately to admissions subdomain (if files exist)
    if (files && files.length > 0) {
      console.log(`Step 2: Uploading ${files.length} files to admissions subdomain...`);
      
      files.forEach((file, index) => {
        console.log(`  File ${index + 1}: ${file.name} (${file.size} bytes)`);
      });
      
      try {
        //uploding the files to ther server
        const uploadResult = await uploadFiles(files, {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          passportNumber: data.passportNumber || 'UNKNOWN'
        });
        
        console.log('✅ Files uploaded successfully:', uploadResult);
        
        if (uploadResult.success && uploadResult.files) {
          const filePaths = uploadResult.files.map((f: any) => f.path);//['uploads/applications/TAMANGNI-RENU-987654321/CITIEDGE_SELF_ASSESSMENT_1770048399_6980cb8f9b65f.pdf', 'uploads/applications/TAMANGNI-RENU-987654321/CITIE…MOCK_TEST_BLANK-COPY_1770048399_6980cb8f9ba4c.pdf']
          console.log('Uploaded file paths:', filePaths);
          console.log(`Folder: ${uploadResult.folder}, Count: ${uploadResult.count}`);
     
          
          // TODO: Update application record with file paths
          // await updateApplicationFiles(applicationId, filePaths);
             console.log('Uploaded file paths:', filePaths);
          console.log(`Folder: ${uploadResult.folder}, Count: ${uploadResult.count}`);
          const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL 
          const firstName = data.firstName || '';
          const lastName = data.lastName || '';
          const passportNumber = data.passportNumber || 'UNKNOWN';
          
          // TODO: Update application record with file paths
          // await updateApplicationFiles(applicationId, filePaths);
          const response = await fetch('/api/agent/applications', {
  method: 'PATCH',
  body: JSON.stringify({
    firstName,
    lastName,
    passportNumber,
    file_paths: filePaths,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});



        }
        
        return { ...data } as AgentApplication; // Return data for now since Step 1 is disabled
      } catch (uploadError) {
        console.error('⚠️ File upload failed:');
        console.error('Error object:', uploadError);
        console.error('Error message:', uploadError instanceof Error ? uploadError.message : String(uploadError));
        throw uploadError;
      }
    }
    
    // If no files, just return the data
    return { ...data } as AgentApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}
