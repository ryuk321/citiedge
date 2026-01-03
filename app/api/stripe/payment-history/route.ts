/**
 * ========================================
 * GET PAYMENT HISTORY API ROUTE
 * ========================================
 * This API retrieves payment history for a specific student from database
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get student ID from URL query parameters
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get API URL from environment or use default
    const apiBaseUrl = process.env.API_BASE_URL || 'https://portals.citiedge.uk/public_html';
    const apiUrl = `${apiBaseUrl}/student_api.php?action=getPaymentHistory&student_id=${encodeURIComponent(studentId)}`;

    // Fetch payment history from PHP API
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-KEY': process.env.API_KEY || 'super-secret-key'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch payment history');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch payment history');
    }

    return NextResponse.json({
      success: true,
      payments: data.payments || [],
    });

  } catch (error: any) {
    console.error('API query error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payment history' },
      { status: 500 }
    );
  }
}
