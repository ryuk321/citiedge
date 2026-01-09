/**
 * ========================================
 * ADMIN INVOICE PAGE
 * ========================================
 * Allows admin/staff to create and send invoices to students
 * Includes invoice form and invoice management
 */

'use client';

import { useState } from 'react';
import InvoiceForm from '@/components/student/InvoiceForm';

export default function AdminInvoicePage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Invoice Management</h1>
          <p className="text-lg text-gray-600">Create and send professional invoices to students</p>
        </div>

        {/* Info Panel */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-blue-800">How Invoicing Works</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Invoice is created in Stripe and emailed to the student</li>
                  <li>Student receives a payment link and PDF invoice</li>
                  <li>Student can pay online or download invoice for records</li>
                  <li>You can set payment due dates (default: 30 days)</li>
                  <li>Track invoice status in Stripe Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <InvoiceForm 
          studentId={selectedStudent?.id}
          studentName={selectedStudent?.name}
          studentEmail={selectedStudent?.email}
        />

        {/* Quick Tips */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">📧 Email Delivery</p>
                <p>In test mode, emails aren't sent. Use the hosted invoice URL to view the invoice.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">🔍 Track Invoices</p>
                <p>View all invoices in your <a href="https://dashboard.stripe.com/invoices" target="_blank" className="text-blue-600 hover:underline">Stripe Dashboard</a></p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">💳 Payment Methods</p>
                <p>Students can pay with credit/debit cards through the hosted invoice page.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">📄 PDF Invoices</p>
                <p>Professional PDF invoices are automatically generated and can be downloaded.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode Reminder */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-800">
                <strong>Test Mode:</strong> Invoices created now won't charge real money. 
                <a href="https://dashboard.stripe.com" target="_blank" className="underline ml-1">Switch to Live Mode</a> when ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
