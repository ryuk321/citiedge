/**
 * ========================================
 * SAVE PAYMENT TO DATABASE API ROUTE
 * ========================================
 * This API saves successful payment records to your database
 * 
 * Called after a payment is successfully processed by Stripe
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the payment data from frontend
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentEmail,
      paymentType,
      amount,
      currency,
      stripePaymentIntentId,
      stripeChargeId,
      paymentStatus,
      description,
      receiptUrl,
    } = body;

    // Validate required fields
    if (!studentId || !studentName || !studentEmail || !paymentType || !amount || !stripePaymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Save payment record via API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/payments/save`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        studentName,
        studentEmail,
        paymentType,
        amount,
        currency: currency || 'GBP',
        stripePaymentIntentId,
        stripeChargeId: stripeChargeId || null,
        paymentStatus: paymentStatus || 'succeeded',
        description: description || null,
        receiptUrl: receiptUrl || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save payment to database via API');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Payment saved to database',
      paymentId: data.paymentId || data.id,
    });

  } catch (error: any) {
    console.error('API save error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save payment to database' },
      { status: 500 }
    );
  }
}
