/**
 * Agent Notifications API Endpoint
 * GET /api/agent/notifications?agentId={agentId}
 * 
 * Returns notifications for an agent
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agent_id, unread_only, limit } = req.query;

    if (!agent_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent ID is required' 
      });
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('agent_id', agent_id as string);
    if (unread_only) params.append('unread_only', unread_only as string);
    if (limit) params.append('limit', limit as string);

    // Call PHP API
    const response = await fetch(`${PHP_API_URL}?action=getAgentNotifications&${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({
      success: true,
      notifications: data.notifications || [],
      unreadCount: data.unread_count
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
