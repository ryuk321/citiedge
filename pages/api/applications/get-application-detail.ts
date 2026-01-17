import type { NextApiRequest, NextApiResponse } from 'next';
import { ApplicationLead } from '@/lib/DB_Table';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Application ID is required' 
      });
    }

    // Build query string for PHP API
    const queryParams = new URLSearchParams({
      action: 'getApplicationDetail',
      id: id.toString()
    });

    // Get base URL from environment and construct full URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/student_api.php';
    const phpApiUrl = `${baseUrl}?${queryParams.toString()}`;
    
    console.log('Calling PHP API for application detail:', phpApiUrl);
    
    const response = await fetch(phpApiUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key',
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
    console.error('Error fetching application detail:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch application details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
