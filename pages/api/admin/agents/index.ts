import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetAgents(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetAgents(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (req.query.status) params.append('status', req.query.status as string);
    if (req.query.search) params.append('search', req.query.search as string);
    if (req.query.limit) params.append('limit', req.query.limit as string);
    if (req.query.offset) params.append('offset', req.query.offset as string);

    // Call PHP API
    const response = await fetch(`${PHP_API_URL}?action=getAgents&${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Fetch agents error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch agents' 
    });
  }
}
