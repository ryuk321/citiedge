import type { NextApiRequest, NextApiResponse } from 'next';

const getPhpApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/student_api.php';
};

const getApiKey = () => {
  return process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const phpApiUrl = getPhpApiUrl();
  const apiKey = getApiKey();

  if (req.method === 'GET') {
    // Get statistics
    try {
      const url = `${phpApiUrl}?action=getApplicationStatistics`;
      console.log('Fetching statistics from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PHP API Error Response:', errorText);
        throw new Error(`PHP API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'DELETE') {
    // Delete application
    const { id } = req.query;
    try {
      const url = `${phpApiUrl}?action=deleteApplication&id=${id}`;
      console.log('Deleting application:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PHP API Error Response:', errorText);
        throw new Error(`PHP API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete application',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'PUT') {
    // Update application
    try {
      const url = `${phpApiUrl}?action=updateApplication`;
      console.log('Updating application:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PHP API Error Response:', errorText);
        throw new Error(`PHP API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to update application',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
