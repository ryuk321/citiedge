import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentId, limit } = req.query;

  if (!studentId) {
    return res.status(400).json({ success: false, error: 'Student ID is required' });
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

    const url = `${apiBaseUrl}?action=getPaymentHistory&student_id=${studentId}${limit ? `&limit=${limit}` : ''}`;

    console.log('Fetching payment history from:', url);

    const response = await fetch(url, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    console.log('Payment history response status:', response.status);

    if (!response.ok) {
      console.error('Payment history API error:', response.status, response.statusText);
      // Return empty payments instead of error for now
      return res.status(200).json({ success: true, payments: [] });
    }

    const responseText = await response.text();
    console.log('Payment history raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse payment history response:', responseText.substring(0, 200));
      // Return empty payments instead of error
      return res.status(200).json({ success: true, payments: [] });
    }

    if (data.success) {
      return res.status(200).json({ success: true, payments: data.payments || [] });
    } else {
      console.log('Payment history returned no data:', data);
      // Return empty payments instead of error
      return res.status(200).json({ success: true, payments: [] });
    }
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    // Return empty payments instead of error to prevent UI breaking
    return res.status(200).json({ success: true, payments: [] });
  }
}
