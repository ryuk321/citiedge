import type { NextApiRequest, NextApiResponse } from 'next';

interface ApplicationData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  programme: string;
  status: string;
  submissionDate: string;
  isAgentApplication: 'Yes' | 'No';
  agentCompany?: string;
  agentName?: string;
  agentEmail?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query string for PHP API
    const queryParams = new URLSearchParams({
      action: 'getApplications',
      page: page.toString(),
      limit: limit.toString(),
      search: search.toString(),
      status: status.toString()
    });

    // Get base URL from environment and construct full URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/student_api.php';
    const phpApiUrl = `${baseUrl}?${queryParams.toString()}`;
    
    console.log('Calling PHP API:', phpApiUrl); // Debug log
    
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
      throw new Error(`PHP API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch applications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
