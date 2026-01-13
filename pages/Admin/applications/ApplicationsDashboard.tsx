'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Statistics {
  total: number;
  pending: number;
  under_review: number;
  accepted: number;
  rejected: number;
  agent_applications: number;
  direct_applications: number;
}

interface AgentStats {
  agentCompany: string;
  agentName: string;
  agentEmail: string;
  applications_count: number;
}

const ApplicationsDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/applications/applications');
      const data = await response.json();
      if (data.success) {
        setStatistics(data.statistics);
        setAgentStats(data.agentStatistics || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application statistics...</p>
        </div>
      </div>
    );
  }

  const statusData = statistics ? [
    { name: 'Pending', value: statistics.pending, color: '#FFA500' },
    { name: 'Under Review', value: statistics.under_review, color: '#3B82F6' },
    { name: 'Accepted', value: statistics.accepted, color: '#10B981' },
    { name: 'Rejected', value: statistics.rejected, color: '#EF4444' },
  ] : [];

  const sourceData = statistics ? [
    { name: 'Agent Applications', value: statistics.agent_applications },
    { name: 'Direct Applications', value: statistics.direct_applications },
  ] : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applications Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all student applications</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics?.pending || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Accepted</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics?.accepted || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics?.rejected || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Application Source Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Application Source</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
              <span className="text-gray-700 font-medium">Direct Applications</span>
              <span className="text-2xl font-bold text-blue-600">{statistics?.direct_applications || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg">
              <span className="text-gray-700 font-medium">Agent Applications</span>
              <span className="text-2xl font-bold text-purple-600">{statistics?.agent_applications || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 text-sm">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Statistics */}
      {agentStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Agents by Application Count</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Agent Company</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Agent Name</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Contact Email</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Applications</th>
                </tr>
              </thead>
              <tbody>
                {agentStats.map((agent, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {agent.agentCompany || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{agent.agentName || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{agent.agentEmail || 'N/A'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                        {agent.applications_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsDashboard;
