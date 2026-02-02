/**
 * Mark Agent Notifications as Read API Endpoint
 * POST /api/agent/notifications/mark-read
 * 
 * Marks notifications as read for an agent
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent_id, notification_ids } = req.body;

    if (!agent_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent ID is required' 
      });
    }

    // Build request body
    const requestBody: any = { agent_id };
    if (notification_ids && notification_ids.length > 0) {
      requestBody.notification_ids = notification_ids;
    }

    // Call PHP API to mark notifications as read
    const response = await fetch(`${PHP_API_URL}?action=markNotificationsRead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({
      success: true,
      message: data.message || 'Notifications marked as read',
      updated_count: data.updated_count
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to mark notifications as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
