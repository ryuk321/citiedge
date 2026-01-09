import React, { useState, useEffect } from 'react';
import EnrollmentsTable from './EnrollmentsTable';
import EnrollmentDetails from './EnrollmentDetails';
import EnrollmentFilters from './EnrollmentFilters';
import EnrollmentStats from './EnrollmentStats';

/**
 * ========================================
 * OFQUAL ENROLLMENTS MANAGEMENT PAGE
 * ========================================
 * Main page for managing OTHM/QUALIFI course enrollments
 * Displays list, filters, and details
 */

export interface Enrollment {
  id: number;
  application_ref: string;
  full_legal_name: string;
  email: string;
  telephone: string;
  date_of_birth: string;
  nationality?: string;
  qualification_title: string;
  qualification_level: string;
  awarding_organisation: string;
  mode_of_study: string;
  highest_qualification: string;
  application_status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled' | 'withdrawn';
  submission_date: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  student_id?: string;
  [key: string]: any;
}

interface Filters {
  status: string;
  level: string;
  organisation: string;
  searchTerm: string;
}

const OfqualEnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    level: 'all',
    organisation: 'all',
    searchTerm: ''
  });

  // Load enrollments on mount
  useEffect(() => {
    loadEnrollments();
  }, []);

  // Apply filters when enrollments or filters change
  useEffect(() => {
    applyFilters();
  }, [enrollments, filters]);

  // Load enrollments from API
  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
      const url = `${apiUrl}?action=getOfqualEnrollments&status=all&limit=500`;

      const response = await fetch(url, {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }

      const result = await response.json();

      if (result.success) {
        setEnrollments(result.enrollments || []);
      } else {
        setError(result.error || 'Failed to load enrollments');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err as Error).message);
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to enrollments
  const applyFilters = () => {
    let filtered = [...enrollments];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(e => e.application_status === filters.status);
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(e => e.qualification_level === filters.level);
    }

    // Organisation filter
    if (filters.organisation !== 'all') {
      filtered = filtered.filter(e => e.awarding_organisation === filters.organisation);
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.full_legal_name.toLowerCase().includes(searchLower) ||
        e.email.toLowerCase().includes(searchLower) ||
        e.application_ref.toLowerCase().includes(searchLower) ||
        e.qualification_title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEnrollments(filtered);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value } as Filters));
  };

  // Handle view details
  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetails(true);
  };

  // Handle update status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
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
          status: newStatus
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reload enrollments
        await loadEnrollments();
        setShowDetails(false);
        alert('Status updated successfully');
      } else {
        alert('Failed to update status: ' + result.error);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating status');
    }
  };

  // Handle delete enrollment
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return;
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost/citiedge-portals/public_html'}/student_api.php`;
      
      const response = await fetch(`${apiUrl}?action=deleteOfqualEnrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'super-secret-key'
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (result.success) {
        await loadEnrollments();
        setShowDetails(false);
        alert('Enrollment deleted successfully');
      } else {
        alert('Failed to delete enrollment: ' + result.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting enrollment');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ofqual Enrollments</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage OTHM/QUALIFI course applications
            </p>
          </div>
          <button
            onClick={loadEnrollments}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4">
        <EnrollmentStats enrollments={enrollments} />
      </div>

      {/* Filters */}
      <div className="px-6 pb-4">
        <EnrollmentFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Enrollments Table */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <EnrollmentsTable
          enrollments={filteredEnrollments}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* Details Modal */}
      {showDetails && selectedEnrollment && (
        <EnrollmentDetails
          enrollment={selectedEnrollment}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default OfqualEnrollmentsPage;
