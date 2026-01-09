/**
 * ========================================
 * STRIPE INVOICE API ROUTE
 * ========================================
 * This API creates and sends Stripe invoices to customers
 * 
 * HOW IT WORKS:
 * 1. Create or retrieve Stripe customer
 * 2. Create invoice items for the charges
 * 3. Create invoice
 * 4. Finalize and send invoice to customer email
 * 
 * Based on: https://docs.stripe.com/invoicing/integration/quickstart
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Initialize Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });

    // Parse request data
    const body = await request.json();
    const { 
      studentId, 
      studentName, 
      studentEmail, 
      items, // Array of {description, amount, quantity}
      daysUntilDue = 30, // Default 30 days
      currency = 'gbp' 
    } = body;

    // Validate required fields
    if (!studentId || !studentName || !studentEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Create or retrieve customer
    // Search for existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: studentEmail,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      
      // Update customer metadata if needed
      await stripe.customers.update(customer.id, {
        name: studentName,
        metadata: {
          student_id: studentId,
        },
      });
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: studentEmail,
        name: studentName,
        metadata: {
          student_id: studentId,
        },
      });
    }

    // Step 2: Create invoice with collection method 'send_invoice'
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice', // Email invoice with payment instructions
      days_until_due: daysUntilDue, // Payment deadline
      currency: currency.toLowerCase(),
      description: `Invoice for ${studentName} (Student ID: ${studentId})`,
      metadata: {
        student_id: studentId,
        student_name: studentName,
      },
      auto_advance: true, // Automatically finalize the invoice
    });

    // Step 3: Add invoice items
    for (const item of items) {
      const amountInCents = Math.round(item.amount * 100);
      
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: amountInCents,
        currency: currency.toLowerCase(),
        description: item.description,
        quantity: item.quantity || 1,
      });
    }

    // Step 4: Finalize the invoice (makes it ready to send)
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // Step 5: Send the invoice via email
    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    // Return invoice details
    return NextResponse.json({
      success: true,
      invoiceId: sentInvoice.id,
      invoiceNumber: sentInvoice.number,
      invoicePdf: sentInvoice.invoice_pdf, // PDF download URL
      hostedInvoiceUrl: sentInvoice.hosted_invoice_url, // Customer payment page
      amountDue: sentInvoice.amount_due / 100, // Convert from cents
      currency: sentInvoice.currency.toUpperCase(),
      status: sentInvoice.status,
      dueDate: sentInvoice.due_date,
      customerEmail: studentEmail,
    });

  } catch (error: any) {
    console.error('Stripe Invoice creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Invoice creation failed' },
      { status: 500 }
    );
  }
}
