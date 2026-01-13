'use client';

import React, { useState, useEffect } from 'react';

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  programme: string;
  status: string;
  submissionDate: string;
  isAgentApplication: 'Yes' | 'No';
  agentCompany?: string;
  agentName?: string;
  agentEmail?: string;
  [key: string]: any;
}

interface EditApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApp: Application) => void;
}

const EditApplicationModal: React.FC<EditApplicationModalProps> = ({ application, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/applications/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave(formData as Application);
        onClose();
      } else {
        setError('Failed to save application');
      }
    } catch (err) {
      setError('An error occurred while saving');
      console.error('Error saving application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/20  flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            {/* Programme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Programme</label>
              <input
                type="text"
                name="programme"
                value={formData.programme || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option className = "text-black" value="pending">Pending</option>
                <option className = "text-black" value="under_review">Under Review</option>
                <option className = "text-black" value="accepted">Accepted</option>
                <option className = "text-black" value="rejected">Rejected</option>
                <option className = "text-black" value="withdrawn">Withdrawn</option>
                <option className = "text-black" value="deferred">Deferred</option>
              </select>
            </div>

            {/* Application Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
              <select
                name="isAgentApplication"
                value={formData.isAgentApplication || 'No'}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option className="text-black" value="No">Direct</option>
                <option className="text-black" value="Yes">Agent</option>
              </select>
            </div>

            {/* Agent Company (conditional) */}
            {formData.isAgentApplication === 'Yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Company</label>
                <input
                  type="text"
                  name="agentCompany"
                  value={formData.agentCompany || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Agent Name (conditional) */}
            {formData.isAgentApplication === 'Yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Agent Email (conditional) */}
            {formData.isAgentApplication === 'Yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Email</label>
                <input
                  type="email"
                  name="agentEmail"
                  value={formData.agentEmail || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditApplicationModal;
