import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * ========================================
 * OFQUAL ENROLLMENT API ENDPOINT
 * ========================================
 * Handles enrollment form submissions for OTHM/QUALIFI courses
 * POST /api/ofqual/enroll
 */

interface EnrollmentData {
  fullLegalName: string;
  dateOfBirth: string;
  gender?: string;
  nationality?: string;
  uln?: string;
  address?: string;
  postcode?: string;
  email: string;
  telephone: string;
  idType: string;
  rightToStudyUK?: string;
  qualificationTitle: string;
  qualificationLevel: string;
  awardingOrganisation: string;
  modeOfStudy: string;
  proposedStartDate?: string;
  highestQualification: string;
  relevantWorkExperience?: string;
  englishProficiency?: string;
  ieltsScore?: string;
  hasDisability?: string;
  disabilityDetails?: string;
  ethnicOrigin?: string;
  requiresAdjustments?: string;
  adjustmentDetails?: string;
  consentToShare?: boolean;
  readPrivacyNotice: boolean;
  consentDataProcessing: boolean;
  agreeToPolicies: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data: EnrollmentData = req.body;

    // Basic validation
    if (!data.fullLegalName || !data.email || !data.telephone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullLegalName, email, or telephone'
      });
    }

    if (!data.readPrivacyNotice || !data.consentDataProcessing || !data.agreeToPolicies) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the privacy notice, data processing, and policies'
      });
    }

    // Get client information for audit trail
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // Prepare data for database insertion
    const enrollmentData = {
      full_legal_name: data.fullLegalName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender || '',
      nationality: data.nationality || '',
      uln: data.uln || '',
      address: data.address || '',
      postcode: data.postcode || '',
      email: data.email,
      telephone: data.telephone,
      id_type: data.idType,
      right_to_study_uk: data.rightToStudyUK || '',
      qualification_title: data.qualificationTitle,
      qualification_level: data.qualificationLevel,
      awarding_organisation: data.awardingOrganisation,
      mode_of_study: data.modeOfStudy,
      proposed_start_date: data.proposedStartDate || null,
      highest_qualification: data.highestQualification,
      relevant_work_experience: data.relevantWorkExperience || '',
      english_proficiency: data.englishProficiency || '',
      ielts_score: data.ieltsScore || '',
      has_disability: data.hasDisability || 'No',
      disability_details: data.disabilityDetails || '',
      ethnic_origin: data.ethnicOrigin || '',
      requires_adjustments: data.requiresAdjustments || 'No',
      adjustment_details: data.adjustmentDetails || '',
      consent_to_share: data.consentToShare ? 1 : 0,
      read_privacy_notice: data.readPrivacyNotice ? 1 : 0,
      consent_data_processing: data.consentDataProcessing ? 1 : 0,
      agree_to_policies: data.agreeToPolicies ? 1 : 0,
      application_status: 'pending',
      ip_address: ipAddress,
      user_agent: userAgent
    };

    // Call the PHP API to insert into database
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
    
    const response = await fetch(`${apiUrl}?action=createOfqualEnrollment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.API_KEY || 'super-secret-key'
      },
      body: JSON.stringify(enrollmentData)
    });

    const result = await response.json();

    if (result.success) {
      // Send confirmation email (implement this based on your email service)
      // await sendConfirmationEmail(data.email, result.application_ref);

      return res.status(200).json({
        success: true,
        message: 'Application submitted successfully',
        applicationRef: result.application_ref,
        data: result
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to submit application'
      });
    }

  } catch (error) {
    console.error('Enrollment API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

/**
 * Helper function to send confirmation email
 * Implement this based on your email service (SendGrid, AWS SES, etc.)
 */
async function sendConfirmationEmail(email: string, applicationRef: string) {
  // TODO: Implement email sending
  // Example with SendGrid, Nodemailer, or other service
  console.log(`Sending confirmation email to ${email} for application ${applicationRef}`);
}
