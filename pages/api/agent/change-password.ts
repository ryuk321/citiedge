/**
 * Agent Change Password API Endpoint
 * POST /api/agent/change-password
 * 
 * Changes agent password after validating current password
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent_id, current_password, new_password } = req.body;

    // Validate inputs
    if (!agent_id || !current_password || !new_password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent ID, current password, and new password are required' 
      });
    }

    // Validate password strength
    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long'
      });
    }

    // Call PHP API to change password
    const response = await fetch(`${PHP_API_URL}?action=changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id,
        current_password,
        new_password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to change password',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
