import type { NextApiRequest, NextApiResponse } from 'next';

// PHP API base URL
const PHP_API_URL = process.env.NEXT_PUBLIC_API_STAFF_PERMISSIONS_BASE_URL as string
const API_KEY = "super-secret-key";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  
  console.log('Permissions API called:', { method, query, body });
  
  try {
    switch (method) {
      case 'GET':
        // Get permissions for a staff member
        const { staff_id } = query;
        
        if (!staff_id) {
          res.status(400).json({ success: false, error: 'staff_id is required' });
          return;
        }

        const getResponse = await fetch(`${PHP_API_URL}?action=getPermissions&staff_id=${staff_id}`, {
          headers: {
            'X-API-KEY': API_KEY
          }
        });
        const permissions = await getResponse.json();
        console.log('Get permissions result:', permissions);
        res.status(getResponse.status).json(permissions);
        break;

      case 'POST':
        // Create or update permission
        const { staff_id: sid, pageId, page_name, canView, canEdit, canDelete, grantedBy } = body;

        console.log('Creating permission with data:', { sid, pageId, page_name, canView, canEdit, canDelete, grantedBy });

        if (!sid || !pageId || !page_name || !grantedBy) {
          res.status(400).json({ 
            success: false, 
            error: 'staff_id, pageId, page_name, and grantedBy are required' 
          });
          return;
        }

        const postResponse = await fetch(`${PHP_API_URL}?action=savePermission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify({
            staff_id: sid,
            pageId,
            page_name,
            canView,
            canEdit,
            canDelete,
            grantedBy
          })
        });
        
        const responseText = await postResponse.text();
        console.log('PHP API raw response:', responseText);
        
        let saveResult;
        try {
          saveResult = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse PHP response:', responseText);
          res.status(500).json({ success: false, error: 'Invalid response from PHP API', details: responseText });
          return;
        }
        
        console.log('Save permission result:', saveResult);
        res.status(postResponse.status).json(saveResult);
        break;

      case 'PUT':
        // Update existing permission
        const { id, ...updateData } = body;

        if (!id) {
          res.status(400).json({ success: false, error: 'Permission id is required' });
          return;
        }

        const putResponse = await fetch(`${PHP_API_URL}?action=updatePermission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
          },
          body: JSON.stringify({ id, ...updateData })
        });
        const updateResult = await putResponse.json();
        res.status(putResponse.status).json(updateResult);
        break;

      case 'DELETE':
        // Delete permission
        const { id: deleteId } = query;

        if (!deleteId) {
          res.status(400).json({ success: false, error: 'Permission id is required' });
          return;
        }

        const deleteResponse = await fetch(`${PHP_API_URL}?action=deletePermission&id=${deleteId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': API_KEY
          }
        });
        const deleteResult = await deleteResponse.json();
        res.status(deleteResponse.status).json(deleteResult);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
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
