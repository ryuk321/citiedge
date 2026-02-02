/**
 * Agent Statistics API Endpoint
 * GET /api/agent/statistics?agentId={agentId}
 * 
 * Returns comprehensive statistics for agent dashboard
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent ID is required' 
      });
    }

    // Call PHP API
    const response = await fetch(`${PHP_API_URL}?action=getAgentStatistics&agent_id=${agentId}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
