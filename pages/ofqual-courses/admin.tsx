"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * ========================================
 * ADMIN: OFQUAL ENROLLMENTS MANAGEMENT
 * ========================================
 * View and manage Ofqual course enrollment applications
 * For admin/staff use only
 */

interface Enrollment {
  id: number;
  application_ref: string;
  full_legal_name: string;
  email: string;
  telephone: string;
  qualification_title: string;
  qualification_level: string;
  awarding_organisation: string;
  application_status: string;
  submission_date: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

export default function OfqualEnrollmentsAdmin() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load enrollments
  useEffect(() => {
    loadEnrollments();
  }, [filterStatus]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
      const url = `${apiUrl}?action=getOfqualEnrollments&status=${filterStatus}`;

      const response = await fetch(url, {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key'
        }
      });

      const result = await response.json();

      if (result.success) {
        setEnrollments(result.enrollments || []);
      } else {
        setError(result.error || 'Failed to load enrollments');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // View enrollment details
  const viewDetails = async (id: number) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
      const url = `${apiUrl}?action=getOfqualEnrollmentById&id=${id}`;

      const response = await fetch(url, {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key'
        }
      });

      const result = await response.json();

      if (result.success) {
        setSelectedEnrollment(result.enrollment);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error loading details:', err);
    }
  };

  // Update status
  const updateStatus = async (id: number, newStatus: string, notes: string = '') => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
      
      const response = await fetch(`${apiUrl}?action=updateOfqualEnrollmentStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key'
        },
        body: JSON.stringify({
          id,
          status: newStatus,
          reviewer_notes: notes
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Status updated successfully');
        loadEnrollments();
        setShowModal(false);
      } else {
        alert('Failed to update status: ' + result.error);
      }
    } catch (err) {
      alert('Error updating status');
      console.error('Update error:', err);
    }
  };

  // Filter enrollments by search term
  const filteredEnrollments = enrollments.filter(e => 
    e.full_legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.application_ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'enrolled': 'bg-purple-100 text-purple-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ofqual Enrollments</h1>
              <p className="text-gray-600 mt-1">Manage OTHM/QUALIFI course applications</p>
            </div>
            <Link
              href="/ofqual-courses/overview"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Courses
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="enrolled">Enrolled</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Name, email, or application ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {enrollments.filter(e => e.application_status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {enrollments.filter(e => e.application_status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Enrolled</p>
            <p className="text-2xl font-bold text-purple-600">
              {enrollments.filter(e => e.application_status === 'enrolled').length}
            </p>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading enrollments...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Enrollments Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ref</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Qualification</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No enrollments found
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-blue-600">
                          {enrollment.application_ref}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.full_legal_name}
                          </div>
                          <div className="text-sm text-gray-500">{enrollment.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {enrollment.qualification_title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {enrollment.qualification_level}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(enrollment.application_status)}`}>
                            {enrollment.application_status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(enrollment.submission_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => viewDetails(enrollment.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Application Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-1">Application Reference</p>
                <p className="text-2xl font-bold text-blue-600">{selectedEnrollment.application_ref}</p>
              </div>

              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedEnrollment.full_legal_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedEnrollment.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telephone</p>
                    <p className="font-medium">{selectedEnrollment.telephone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedEnrollment.application_status)}`}>
                      {selectedEnrollment.application_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Qualification Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualification Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Qualification</p>
                    <p className="font-medium">{selectedEnrollment.qualification_title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Level</p>
                    <p className="font-medium">{selectedEnrollment.qualification_level}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Awarding Organisation</p>
                    <p className="font-medium">{selectedEnrollment.awarding_organisation}</p>
                  </div>
                </div>
              </div>

              {/* Reviewer Notes */}
              {selectedEnrollment.reviewer_notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Reviewer Notes</h3>
                  <div className="bg-gray-50 rounded p-4 text-sm">
                    {selectedEnrollment.reviewer_notes}
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'under_review', 'Application under review')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'approved', 'Application approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'rejected', 'Application rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(selectedEnrollment.id, 'enrolled', 'Student enrolled successfully')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Mark as Enrolled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
