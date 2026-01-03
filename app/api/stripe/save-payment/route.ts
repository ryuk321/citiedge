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

    // Get API URL from environment or use default
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const apiUrl = `${apiBaseUrl}?action=savePayment`;
    
    console.log('Saving payment to database:', {
      apiUrl,
      studentId,
      paymentIntentId: stripePaymentIntentId,
      amount
    });
    
    // Save payment record via PHP API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY as string,
       },
      body: JSON.stringify({
        student_id: studentId,
        student_name: studentName,
        student_email: studentEmail,
        payment_type: paymentType,
        amount: amount,
        currency: currency || 'GBP',
        stripe_payment_intent_id: stripePaymentIntentId,
        stripe_charge_id: stripeChargeId || null,
        payment_status: paymentStatus || 'succeeded',
        description: description || null,
        receipt_url: receiptUrl || null,
      }),
    });

    console.log('PHP API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PHP API Error Response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: 'Invalid JSON response', raw: errorText.substring(0, 200) };
      }
      throw new Error(errorData.error || 'Failed to save payment to database');
    }

    const responseText = await response.text();
    console.log('PHP API Success Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText.substring(0, 200));
      throw new Error('Invalid JSON response from API');
    }

    if (!data.success) {
      console.error('Payment save failed:', data);
      throw new Error(data.error || 'Failed to save payment');
    }

    console.log('Payment saved successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Payment saved to database',
      paymentId: data.payment_id,
    });

  } catch (error: any) {
    console.error('API save error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save payment to database' },
      { status: 500 }
    );
  }
}
