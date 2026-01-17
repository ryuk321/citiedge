'use client';

import React, { useState } from 'react';
import ApplicationsDashboard from './ApplicationsDashboard';
import ApplicationsTable from './ApplicationsTable';
import EditApplicationModal from './EditApplicationModal';
import ApplicationDetailView from './ApplicationDetailView';
import { ApplicationLead } from '@/lib/DB_Table';

interface Application {
  id: number;
  first_name: string;
  last_name: string;
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

type ViewType = 'dashboard' | 'table';

const ApplicationsPage: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const handleView = (id: number) => {
    setSelectedApplicationId(id);
    setIsDetailViewOpen(true);
  };

  const handleEdit = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleEditFromDetail = (app: ApplicationLead) => {
    setSelectedApplication(app as any);
    setIsDetailViewOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // Delete is handled by ApplicationsTable internally
    // This callback can be used for additional cleanup if needed
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDetailViewClose = () => {
    setIsDetailViewOpen(false);
    setSelectedApplicationId(null);
  };

  const handleSave = (updatedApp: Application) => {
    // The modal will handle the save, we just need to close it
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="text-gray-600 mt-1">Manage and review all student applications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setView('dashboard')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              view === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </div>
          </button>

          <button
            onClick={() => setView('table')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              view === 'table'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 5h.01M15 5h.01M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
              View All Applications
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {view === 'dashboard' ? (
          <ApplicationsDashboard />
        ) : (
          <ApplicationsTable 
            onView={handleView} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Detail View */}
      {isDetailViewOpen && selectedApplicationId && (
        <ApplicationDetailView
          applicationId={selectedApplicationId}
          onClose={handleDetailViewClose}
          onEdit={handleEditFromDetail}
        />
      )}

      {/* Edit Modal */}
      <EditApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default ApplicationsPage;
