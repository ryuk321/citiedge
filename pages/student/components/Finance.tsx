import React, { useState, useEffect } from 'react';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FinanceProps {
  studentId: number;
  studentName: string;
  studentEmail: string;
}

interface TuitionFee {
  id: number;
  academic_year: string;
  semester: string;
  total_fee: string;
  amount_paid: string;
  balance: string;
  status: string;
  due_date: string;
}

interface Payment {
  id: number;
  payment_type: string;
  amount: string;
  currency: string;
  payment_status: string;
  created_at: string;
  receipt_url: string | null;
}

export default function Finance({ studentId, studentName, studentEmail }: FinanceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'history'>('overview');
  const [tuitionFees, setTuitionFees] = useState<TuitionFee[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    fetchFinanceData();
  }, [studentId]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch tuition fees
      const feesResponse = await fetch(`/api/student/tuition-fees?studentId=${studentId}`);
      const feesData = await feesResponse.json();
      
      // console.log('Fees API Response:', feesData);
      
      if (feesData.success) {
        const fees = (feesData.fees || []).map((fee: any) => ({
          id: fee.id,
          academic_year: fee.academic_year,
          semester: fee.semester || 'Unknown',
          total_fee: fee.total_amount || '0',
          amount_paid: fee.paid_amount || '0',
          balance: fee.due_amount || '0',
          status: fee.status || 'pending',
          due_date: fee.due_date
        }));
        
        // console.log('Mapped fees:', fees);
        setTuitionFees(fees);
      }
      
      // Fetch payment history
      const paymentsResponse = await fetch(`/api/student/payment-history?studentId=${studentId}`);
      const paymentsData = await paymentsResponse.json();
      
      // console.log('Payment History API Response:', paymentsData);
      // console.log('Payment History Status:', paymentsResponse.status);
      
      if (paymentsData.success) {
        // console.log('Payment history data:', paymentsData.payments);
        setPaymentHistory(paymentsData.payments || []);
      } else {
        console.error('Failed to fetch payment history:', paymentsData.error);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals safely
  const calculateTotals = () => {
    const pending = tuitionFees.reduce((sum, fee) => {
      const balance = parseFloat(fee.balance) || 0;
      return sum + (isNaN(balance) ? 0 : balance);
    }, 0);
    
    const paid = tuitionFees.reduce((sum, fee) => {
      const amountPaid = parseFloat(fee.amount_paid) || 0;
      return sum + (isNaN(amountPaid) ? 0 : amountPaid);
    }, 0);
    
    return { pending, paid };
  };

  const { pending: totalPending, paid: totalPaid } = calculateTotals();

  // console.log('Total Pending:', totalPending); // Debug log
  // console.log('Total Paid:', totalPaid); // Debug log
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Finance & Payments</h1>
        <p className="text-slate-500">Manage your tuition fees and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-1">Total Tuition</div>
          <div className="text-3xl font-bold">£{(totalPaid + totalPending).toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-1">Amount Paid</div>
          <div className="text-3xl font-bold">£{totalPaid.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white">
          <div className="text-sm opacity-90 mb-1">Pending Balance</div>
          <div className="text-3xl font-bold">£{totalPending.toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Fee Overview
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'payments'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Make Payment
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Payment History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <TuitionFeesOverview fees={tuitionFees} onPayClick={() => setActiveTab('payments')} />
      )}
      
      {activeTab === 'payments' && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            studentId={studentId}
            studentName={studentName}
            studentEmail={studentEmail}
            tuitionFees={tuitionFees}
            onPaymentSuccess={fetchFinanceData}
          />
        </Elements>
      )}
      
      {activeTab === 'history' && (
        <PaymentHistoryView payments={paymentHistory} />
      )}
    </div>
  );
}

function TuitionFeesOverview({ fees, onPayClick }: { fees: TuitionFee[]; onPayClick: () => void }) {
  return (
    <div className="space-y-4">
      {fees.length > 0 ? (
        fees.map((fee) => (
          <div key={fee.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {fee.academic_year} - {fee.semester}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Due: {new Date(fee.due_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                fee.status === 'paid' 
                  ? 'bg-green-100 text-green-700'
                  : fee.status === 'partial'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {fee.status ? fee.status.charAt(0).toUpperCase() + fee.status.slice(1) : 'Pending'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Total Fee</div>
                <div className="text-xl font-bold text-slate-900">£{parseFloat(fee.total_fee).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Amount Paid</div>
                <div className="text-xl font-bold text-green-600">£{parseFloat(fee.amount_paid).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Balance</div>
                <div className="text-xl font-bold text-red-600">£{parseFloat(fee.balance).toFixed(2)}</div>
              </div>
            </div>
            
            {parseFloat(fee.balance) > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={onPayClick}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Pay Now
                </button>
                <button className="px-4 py-2.5 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                  Download Invoice
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-500">No tuition fees found</p>
        </div>
      )}
    </div>
  );
}

function PaymentForm({ studentId, studentName, studentEmail, tuitionFees, onPaymentSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe is not loaded');
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const paymentData = {
        amount: parseFloat(amount), // Send amount in pounds
        currency: 'gbp',
        studentId,
        studentName,
        studentEmail,
        paymentType: 'Tuition Fee',
        description: `Tuition Payment for ${studentName}`
      };

      // console.log('Creating payment intent with:', paymentData);

      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();
      // console.log('API Response:', responseData);
      // console.log('Response Status:', response.status);

      if (!response.ok) {
        setError(responseData.error || `Server error: ${response.status}`);
        setProcessing(false);
        return;
      }

      const { clientSecret, error: apiError } = responseData;

      if (apiError) {
        setError(apiError);
        setProcessing(false);
        return;
      }

      if (!clientSecret) {
        setError('No client secret received from server');
        setProcessing(false);
        return;
      }

      // console.log('Confirming payment with clientSecret');

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: studentName,
            email: studentEmail
          }
        }
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      // console.log('Payment Intent:', paymentIntent);

      // Get charge details safely
      let chargeId: string | undefined;
      let receiptUrl: string | undefined;
      
      // @ts-ignore - charges property exists at runtime but not in type definition
      if (paymentIntent && paymentIntent.charges) {
        // @ts-ignore
        const charges = paymentIntent.charges;
        if (charges.data && charges.data.length > 0) {
          chargeId = charges.data[0].id;
          receiptUrl = charges.data[0].receipt_url;
        }
      }

      // Save payment to database
      const saveResponse = await fetch('/api/stripe/save-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentId,
          studentName: studentName,
          studentEmail: studentEmail,
          paymentType: 'Tuition Fee',
          amount: parseFloat(amount),
          currency: 'GBP',
          stripePaymentIntentId: paymentIntent?.id,
          stripeChargeId: chargeId,
          paymentStatus: paymentIntent?.status,
          receiptUrl: receiptUrl
        })
      });

      const saveResult = await saveResponse.json();
      // console.log('Save payment result:', saveResult);

      if (saveResult.success) {
        setSuccess(true);
        setAmount('');
        cardElement.clear();
        onPaymentSuccess();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Payment succeeded but failed to save. Please contact support.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const pendingFees = tuitionFees.filter((f: TuitionFee) => parseFloat(f.balance) > 0);

  return (
    <div className="max-w-2xl">
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="text-green-800">Payment processed successfully!</div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Make a Payment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount (£)
            </label>
            <input
           
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-black"
              placeholder="0.00"
              disabled={processing}
            />
            {pendingFees.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {pendingFees.map((fee: TuitionFee) => (
                  <button
                    key={fee.id}
                    type="button"
                    onClick={() => setAmount(fee.balance)}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-black"
                  >
                    Pay £{parseFloat(fee.balance).toFixed(2)} - {fee.semester}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Card Details
            </label>
            <div className="border border-slate-300 rounded-lg p-4 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1e293b',
                      '::placeholder': { color: '#94a3b8' }
                    }
                  }
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay £{amount || '0.00'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Payment
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            PCI Compliant
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentHistoryView({ payments }: { payments: Payment[] }) {
  // console.log('PaymentHistoryView payments:', payments);
  // console.log('Payments count:', payments?.length || 0);
  
  return (
    <div className="space-y-3">
      {payments && payments.length > 0 ? (
        payments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  payment.payment_status === 'succeeded'
                    ? 'bg-green-100'
                    : payment.payment_status === 'pending'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    payment.payment_status === 'succeeded'
                      ? 'text-green-600'
                      : payment.payment_status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {payment.payment_status === 'succeeded' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{payment.payment_type}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(payment.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  £{parseFloat(payment.amount).toFixed(2)} {payment.currency?.toUpperCase() || 'GBP'}
                </div>
                <div className={`text-sm font-medium ${
                  payment.payment_status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {payment.payment_status ? payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1) : 'Pending'}
                </div>
              </div>
            </div>
            {payment.receipt_url && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <a
                  href={payment.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Receipt
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-500">No payment history yet</p>
        </div>
      )}
    </div>
  );
}
