/**
 * Agent Login API Endpoint
 * POST /api/agent/login
 * 
 * Authenticates agent and returns profile if successful
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Call PHP API for authentication
    const response = await fetch(`${PHP_API_URL}?action=loginAgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // If login successful, return agent data
    res.status(200).json({
      success: true,
      agent: data.agent,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
