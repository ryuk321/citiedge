import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API base URL - using student_api.php for createUser function
const PHP_API_URL = process.env.NEXT_PUBLIC_API_USERS_LOG_BASE_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  try {
    switch (method) {
      case 'GET':
        // Get all users
        const getResponse = await fetch(`${PHP_API_URL}?action=getAllUsers`, {
          headers: {
            
            'X-API-KEY': API_KEY
          }
        });
        const users = await getResponse.json();
        res.status(getResponse.status).json(users);
        break;

      case 'POST':
        // Create a new user
        const postResponse = await fetch(`${PHP_API_URL}?action=createUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify(req.body)
        });
        const result = await postResponse.json();
        res.status(postResponse.status).json(result);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'API error', 
      details: error.message 
    });
  }
}
