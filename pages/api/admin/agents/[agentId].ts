import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { agentId } = req.query;

  if (!agentId || typeof agentId !== 'string') {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  if (req.method === 'GET') {
    return handleGetAgent(agentId, req, res);
  } else if (req.method === 'PATCH') {
    return handleUpdateAgent(agentId, req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteAgent(agentId, req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetAgent(agentId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${PHP_API_URL}?action=getAgentById&agent_id=${agentId}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

async function handleUpdateAgent(agentId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${PHP_API_URL}?action=updateAgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        ...req.body
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

async function handleDeleteAgent(agentId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${PHP_API_URL}?action=deleteAgent&agent_id=${agentId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
