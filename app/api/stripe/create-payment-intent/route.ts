/**
 * ========================================
 * STRIPE CHECKOUT API ROUTE
 * ========================================
 * This API creates a Stripe Payment Intent for processing payments
 * 
 * HOW IT WORKS:
 * 1. Student fills out payment form on frontend
 * 2. Frontend calls this API with payment details
 * 3. This API creates a PaymentIntent with Stripe
 * 4. Returns client_secret to frontend
 * 5. Frontend uses client_secret to confirm payment
 * 6. Payment is recorded in database
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (NEVER expose this to frontend!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover', // Latest Stripe API version
});

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request data
    const body = await request.json();
    const { amount, currency, studentId, studentName, studentEmail, paymentType, description } = body;

    // Validate required fields
    if (!amount || !currency || !studentId || !studentName || !studentEmail || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe requires amounts in smallest currency unit)
    // For example: $10.50 becomes 1050 cents
    const amountInCents = Math.round(amount * 100);

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(), // Stripe requires lowercase currency
      
      // Attach metadata to track this payment
      metadata: {
        student_id: studentId,
        student_name: studentName,
        student_email: studentEmail,
        payment_type: paymentType,
        description: description || 'No description provided',
      },
      
      // Optional: Add description for Stripe dashboard
      description: `${paymentType} payment by ${studentName} (${studentId})`,
      
      // Receipt email will be sent to student
      receipt_email: studentEmail,
    });

    // Return the client secret to frontend
    // Frontend will use this to confirm the payment
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error('Stripe PaymentIntent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
