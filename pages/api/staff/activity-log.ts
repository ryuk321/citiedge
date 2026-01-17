import type { NextApiRequest, NextApiResponse } from 'next';

    // PHP API base URL
    const PHP_API_URL = process.env.NEXT_PUBLIC_API_STAFF_ACTIVITY_LOG_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string ;

/**
 * Log staff activity for audit trail
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { 
    staff_id, 
    staff_name, 
    action, 
    target_type, 
    target_id, 
    target_name,
    changes 
  } = req.body;

  // Validate required fields
  if (!staff_id || !staff_name || !action || !target_type || !target_id) {
    res.status(400).json({ 
      success: false, 
      error: 'staff_id, staff_name, action, target_type, and target_id are required' 
    });
    return;
  }

  try {
    const response = await fetch(`${PHP_API_URL}?action=logActivity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify({
        staff_id,
        staff_name,
        action,
        target_type,
        target_id,
        target_name,
        changes
      })
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error: any) {
    console.error('Error logging activity:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to log activity', 
      details: error.message 
    });
  }
}

/**
 * Helper function to log activity from other API endpoints
 */
export async function logStaffActivity(
  staff_id: string,
  staff_name: string,
  action: 'create' | 'update' | 'delete' | 'view',
  target_type: 'student' | 'application' | 'enrollment' | 'attendance' | 'grade' | 'other',
  target_id: string,
  target_name?: string,
  changes?: any
) {
  try {
    await fetch(`${PHP_API_URL}?action=logActivity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify({
        staff_id,
        staff_name,
        action,
        target_type,
        target_id,
        target_name,
        changes
      })
    });
  } catch (error) {
    console.error('Error logging staff activity:', error);
  }
}
