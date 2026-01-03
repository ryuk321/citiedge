import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

    const response = await fetch(`${apiBaseUrl}/student_api.php?action=generateStudentId`, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        studentId: data.studentId,
        nextId: data.nextId 
      });
    } else {
      return res.status(500).json({ success: false, error: data.error || 'Failed to generate student ID' });
    }
  } catch (error: any) {
    console.error('Error generating student ID:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate student ID' });
  }
}
