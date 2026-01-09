import React from 'react';

interface FiltersProps {
  filters: {
    status: string;
    level: string;
    organisation: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const EnrollmentFilters: React.FC<FiltersProps> = ({ filters = { status: '', level: '', organisation: '', searchTerm: '' }, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Name, email, or application ref..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="enrolled">Enrolled</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => onFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="Level 3">Level 3</option>
            <option value="Level 4">Level 4</option>
            <option value="Level 5">Level 5</option>
            <option value="Level 6">Level 6</option>
            <option value="Level 7">Level 7</option>
            <option value="Level 8">Level 8</option>
          </select>
        </div>
      </div>

      {/* Additional row for Organisation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Awarding Organisation
          </label>
          <select
            value={filters.organisation}
            onChange={(e) => onFilterChange('organisation', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Organisations</option>
            <option value="OTHM">OTHM</option>
            <option value="QUALIFI">QUALIFI</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              onFilterChange('status', 'all');
              onFilterChange('level', 'all');
              onFilterChange('organisation', 'all');
              onFilterChange('searchTerm', '');
            }}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFilters;
