/**
 * ========================================
 * GET PAYMENT HISTORY API ROUTE
 * ========================================
 * This API retrieves payment history for a specific student
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

    // Fetch payment history from API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/payments/history?studentId=${studentId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch payment history from API');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      payments: data.payments || data,
    });

  } catch (error: any) {
    console.error('API query error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payment history' },
      { status: 500 }
    );
  }
}
