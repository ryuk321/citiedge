import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ success: false, error: 'Student ID is required' });
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
    const response = await fetch(
      `${apiBaseUrl}?action=getStudentTuitionFees&student_id=${studentId}`,
      {
        headers: {
          'X-API-KEY': apiKey,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true, fees: data.fees });
    } else {
      return res.status(404).json({ success: false, error: data.error || 'Fees not found' });
    }
  } catch (error: any) {
    console.error('Error fetching tuition fees:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch tuition fees' });
  }
}
