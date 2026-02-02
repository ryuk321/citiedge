import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost/citiedge-portals/public_html/agent_api.php';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handleRegister(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Forward the request to PHP API
    const response = await fetch(`${PHP_API_URL}?action=registerAgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);

  } catch (error: any) {
    console.error('Agent registration error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to register agent' 
    });
  }
}
