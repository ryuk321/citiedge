/**
 * ========================================
 * INVOICE FORM COMPONENT
 * ========================================
 * Allows staff/admin to create and send invoices to students
 * Uses Stripe Invoicing API
 */

'use client';

import { useState } from 'react';

interface InvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}

interface InvoiceFormProps {
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
}

export default function InvoiceForm({ 
  studentId = '', 
  studentName = '', 
  studentEmail = '' 
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    studentId,
    studentName,
    studentEmail,
    daysUntilDue: 30,
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Tuition Fee - Term 1', amount: 0, quantity: 1 },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [invoiceResult, setInvoiceResult] = useState<any>(null);

  // Add new invoice item
  const addItem = () => {
    setItems([...items, { description: '', amount: 0, quantity: 1 }]);
  };

  // Remove invoice item
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update invoice item
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Calculate total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');
    setInvoiceResult(null);

    try {
      // Validate
      if (!formData.studentId || !formData.studentName || !formData.studentEmail) {
        throw new Error('Please fill in all student information');
      }

      if (items.length === 0 || items.some(item => !item.description || item.amount <= 0)) {
        throw new Error('Please add at least one valid invoice item');
      }

      // Create invoice
      const response = await fetch('/api/stripe/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          items: items,
          daysUntilDue: formData.daysUntilDue,
          currency: 'GBP',
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setInvoiceResult(result);
      setMessage(`Invoice ${result.invoiceNumber} created and sent to ${formData.studentEmail}`);
      setMessageType('success');

      // Reset form
      setItems([{ description: 'Tuition Fee - Term 1', amount: 0, quantity: 1 }]);

    } catch (error: any) {
      setMessage(error.message || 'Failed to create invoice');
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Invoice
          </h2>
          <p className="text-purple-100 mt-1">Send a professional invoice to a student</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Student Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.studentEmail}
                onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Payment Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Days Until Due
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.daysUntilDue}
              onChange={(e) => setFormData({ ...formData, daysUntilDue: parseInt(e.target.value) })}
              className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Due date: {new Date(Date.now() + formData.daysUntilDue * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-gray-900">
                Invoice Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Amount"
                      value={item.amount || ''}
                      onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-purple-600">
                £{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Invoice Result */}
          {invoiceResult && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Invoice Created Successfully!</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <p><strong>Invoice Number:</strong> {invoiceResult.invoiceNumber}</p>
                <p><strong>Amount Due:</strong> £{invoiceResult.amountDue}</p>
                <p><strong>Status:</strong> {invoiceResult.status}</p>
                <p><strong>Due Date:</strong> {new Date(invoiceResult.dueDate * 1000).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-3">
                  <a
                    href={invoiceResult.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Download PDF
                  </a>
                  <a
                    href={invoiceResult.hostedInvoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    View Invoice
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || calculateTotal() <= 0}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Invoice...
              </span>
            ) : (
              'Create and Send Invoice'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
