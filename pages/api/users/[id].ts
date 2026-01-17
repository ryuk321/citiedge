import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API base URL
const PHP_API_URL = process.env.NEXT_PUBLIC_API_USERS_LOG_BASE_URL || 'http://localhost/citiedg-portals/public_html/users_api.php';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  const { id } = query;
  
  if (!id) {
    res.status(400).json({ success: false, error: 'User ID is required' });
    return;
  }
  
  try {
    switch (method) {
      case 'GET':
        // Get single user
        const getResponse = await fetch(`${PHP_API_URL}?action=getUser&id=${id}`, {
          headers: {
            'X-API-KEY': API_KEY
          }
        });
        const user = await getResponse.json();
        res.status(getResponse.status).json(user);
        break;

      case 'PUT':
        // Update user
        const putResponse = await fetch(`${PHP_API_URL}?action=updateUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify({ id, ...body })
        });
        const updateResult = await putResponse.json();
        res.status(putResponse.status).json(updateResult);
        break;

      case 'DELETE':
        // Delete user
        const deleteResponse = await fetch(`${PHP_API_URL}?action=deleteUser&id=${id}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': API_KEY
          }
        });
        const deleteResult = await deleteResponse.json();
        res.status(deleteResponse.status).json(deleteResult);
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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
