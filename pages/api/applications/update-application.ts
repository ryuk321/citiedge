import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Build dynamic UPDATE query based on provided fields
    const fields = Object.keys(data);
    const setClause = fields.map(field => {
      // Convert camelCase to snake_case for database columns
      const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
      return `${dbField} = ?`;
    }).join(', ');

    const values = Object.values(data);
    values.push(id); // Add id for WHERE clause

    const query = `UPDATE applications SET ${setClause} WHERE id = ?`;

    // Make request to your PHP API
    const apiUrl = 'https://admissions.citiedgecollege.co.uk/update_application_api.php';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data })
    });

    const result = await response.json();

    if (result.success) {
      return res.status(200).json({ success: true, message: 'Application updated successfully' });
    } else {
      return res.status(500).json({ success: false, error: result.error || 'Failed to update application' });
    }
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
