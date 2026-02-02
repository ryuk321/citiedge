/**
 * Agent Applications API Endpoint
 * GET /api/agent/applications?agentId={agentId}
 * POST /api/agent/applications (create new application)
 * 
 * Manages agent's student applications
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Fields, Files, File } from 'formidable';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

// PHP API endpoint
const PHP_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ;
// console.log('PHP_API_URL configured as:', PHP_API_URL);

// Enable body parsing for JSON (files go directly to admissions subdomain now)
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`\n🔥 API ROUTE HIT: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers['content-type']);
  
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    console.log('=== Reached POST /api/agent/applications endpoint ===');
    return handlePost(req, res);
  } else if (req.method === 'PATCH') {
    console.log('=== Reached PATCH /api/agent/applications endpoint ===');
    return handlePatch(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { agent_id, status, limit, offset } = req.query;

    if (!agent_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent ID is required' 
      });
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('agent_id', agent_id as string);
    if (status) params.append('status', status as string);
    if (limit) params.append('limit', limit as string);
    if (offset) params.append('offset', offset as string);

    // Call PHP API
    const response = await fetch(`${PHP_API_URL}?action=getAgentApplications&${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({
      success: true,
      applications: data.applications || []
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch applications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== INSIDE handlePost function ===');
  try {
    // Get JSON body (files are now uploaded separately to admissions subdomain)
    const applicationData = req.body;
    
    console.log('=== RECEIVED APPLICATION DATA ===');
    console.log('Application data:', applicationData);

    // Validate required fields
    if (!applicationData.agent_id || !applicationData.firstName || !applicationData.lastName || 
        !applicationData.email || !applicationData.programme) {
      console.error('Missing required fields:', {
        agent_id: applicationData.agent_id,
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        programme: applicationData.programme
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        received: Object.keys(applicationData)
      });
    }

    console.log('=== SENDING TO PHP API ===');
    console.log('URL:', `${PHP_API_URL}?action=createAgentApplication`);
    console.log('Data:', JSON.stringify(applicationData, null, 2));
    
    // Call PHP API with JSON (no files)
    const response = await fetch(`${PHP_API_URL}?action=createAgentApplication`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('PHP Response status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('PHP Response body:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PHP response as JSON:', e);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from PHP API',
        details: responseText.substring(0, 500)
      });
    }

    if (!response.ok || !data.success) {
      console.error('PHP API error:', data);
      return res.status(response.status || 500).json(data);
    }

    console.log('Application created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create application',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== INSIDE handlePatch function ===');
  try {
    const {  firstName, lastName, passportNumber, file_paths } = req.body;
    
    console.log('=== UPDATE APPLICATION WITH FILES ===');

    console.log('Student:', firstName, lastName);
    console.log('Passport:', passportNumber);
    console.log('File paths:', file_paths);




    if (!firstName || !lastName || !passportNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Student information (firstName, lastName, passportNumber) is required' 
      });
    }

    if (!file_paths || !Array.isArray(file_paths)) {
      return res.status(400).json({ 
        success: false, 
        error: 'File paths array is required' 
      });
    }

    // Call PHP API to update application with validation data
    const response = await fetch(`${PHP_API_URL}?action=updateApplicationFiles`, {
      method: 'POST',
      body: JSON.stringify({
  
        firstName,
        lastName,
        passportNumber,
        file_paths,

      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('PHP Response status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('PHP Response body:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PHP response as JSON:', e);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from PHP API',
        details: responseText.substring(0, 500)
      });
    }

    if (!response.ok || !data.success) {
      console.error('PHP API error:', data);
      return res.status(response.status || 500).json(data);
    }

    console.log('Application files updated successfully:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating application files:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update application files',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
