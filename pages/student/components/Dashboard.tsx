import React, { useState, useEffect } from 'react';

interface DashboardProps {
  studentId: number;
  studentName: string;
  studentEmail: string;
}

interface QuickStats {
  totalFees: number;
  paidAmount: number;
  pendingBalance: number;
  upcomingClasses: number;
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

export default function Dashboard({ studentId, studentName, studentEmail }: DashboardProps) {
  const [stats, setStats] = useState<QuickStats>({
    totalFees: 0,
    paidAmount: 0,
    pendingBalance: 0,
    upcomingClasses: 0
  });
  const [loading, setLoading] = useState(true);
    const [tuitionFees, setTuitionFees] = useState<TuitionFee[]>([]);
  
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [studentId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tuition fees
      // const feesResponse = await fetch(`/api/student/tuition-fees?studentId=${studentId}`);
      // const feesData = await feesResponse.json();
      const feesResponse = await fetch(`/api/student/tuition-fees?studentId=${studentId}`);
      const feesData = await feesResponse.json();
      
      // Fetch recent payments
      const paymentsResponse = await fetch(`/api/student/payment-history?studentId=${studentId}&limit=5`);
      const paymentsData = await paymentsResponse.json();
      
      // console.log('Fees data:', feesData);
      // console.log('Payments data:', paymentsData);
      
      if (feesData.success && feesData.fees && feesData.fees.length > 0) {
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
        
        // Calculate totals by summing all fees in the array
        const totalFees = fees.reduce((sum: number, fee: any) => sum + (parseFloat(fee.total_fee) || 0), 0);
        const paidAmount = fees.reduce((sum: number, fee: any) => sum + (parseFloat(fee.amount_paid) || 0), 0);
        const pendingBalance = fees.reduce((sum: number, fee: any) => sum + (parseFloat(fee.balance) || 0), 0);
        
        // console.log('Calculated totals:', { totalFees, paidAmount, pendingBalance });
        
        setStats({
          totalFees,
          paidAmount,
          pendingBalance,
          upcomingClasses: 8 // Mock data
        });
      } else {
        // console.log('No fees found, setting defaults');
        setStats({
          totalFees: 0,
          paidAmount: 0,
          pendingBalance: 0,
          upcomingClasses: 0
        });
      }
      
      if (paymentsData.success && paymentsData.payments) {
        setRecentPayments(paymentsData.payments);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {studentName}!</h1>
        <p className="text-slate-300">Here's an overview of your academic progress</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fees"
          value={`£${(stats.totalFees || 0).toFixed(2)}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Amount Paid"
          value={`£${(stats.paidAmount || 0).toFixed(2)}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="Pending Balance"
          value={`£${(stats.pendingBalance || 0).toFixed(2)}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="red"
        />
        <StatCard
          title="Upcoming Classes"
          value={stats.upcomingClasses.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Payments</h2>
        {recentPayments.length > 0 ? (
          <div className="space-y-3">
            {recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{payment.payment_type}</div>
                    <div className="text-sm text-slate-500">
                      {new Date(payment.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">£{parseFloat(payment.amount).toFixed(2)}</div>
                  <div className="text-xs text-green-600 font-medium">{payment.payment_status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No payment history yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Make Payment"
          description="Pay your tuition fees"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          color="blue"
        />
        <QuickActionCard
          title="View Classes"
          description="Check your schedule"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="green"
        />
        <QuickActionCard
          title="Update Profile"
          description="Manage your information"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="purple"
        />
      </div>
    </div>
  );
}

type StatColor = 'blue' | 'green' | 'red' | 'purple';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: StatColor;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses: Record<StatColor, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );
}

type QuickActionColor = 'blue' | 'green' | 'purple';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: QuickActionColor;
}

function QuickActionCard({ title, description, icon, color }: QuickActionCardProps) {
  const colorClasses: Record<QuickActionColor, string> = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
  };

  return (
    <button className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </button>
  );
}
