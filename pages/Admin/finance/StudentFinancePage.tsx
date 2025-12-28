import React, { useState, useEffect } from "react";
import Notification, { NotificationProps } from '../../../components/Notification';

// API Configuration
const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

interface QualificationData {
  id: number;
  subject_name: string;
  subject_slug: string;
  category: string;
  level_6_title: string;
  level_6_qualification: string;
  level_6_finance_eligible: boolean;
  level_7_title: string;
  level_7_qualification: string;
  level_7_finance_eligible: boolean;
  level_8_title: string;
  level_8_qualification: string;
  level_8_finance_eligible: boolean;
  professional_route: string;
  is_regulated: boolean;
  regulatory_body: string;
  special_notes: string;
  display_order: number;
  is_active: boolean;
}

interface GeneralInfoData {
  id: number;
  section_title: string;
  section_slug: string;
  section_type: string;
  content: string;
  display_order: number;
  is_active: boolean;
  icon: string;
  color_code: string;
}

const StudentFinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qualifications' | 'general'>('qualifications');
  const [qualifications, setQualifications] = useState<QualificationData[]>([]);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QualificationData | GeneralInfoData | null>(null);
   const [notification, setNotification] = useState<NotificationProps | null>(null);

  // Form data for qualifications
  const [qualFormData, setQualFormData] = useState<Partial<QualificationData>>({
    subject_name: "",
    subject_slug: "",
    category: "General",
    level_6_title: "",
    level_6_qualification: "",
    level_6_finance_eligible: true,
    level_7_title: "",
    level_7_qualification: "",
    level_7_finance_eligible: true,
    level_8_title: "",
    level_8_qualification: "",
    level_8_finance_eligible: true,
    professional_route: "",
    is_regulated: false,
    regulatory_body: "",
    special_notes: "",
    display_order: 0,
    is_active: true,
  });

  // Form data for general info
  const [genInfoFormData, setGenInfoFormData] = useState<Partial<GeneralInfoData>>({
    section_title: "",
    section_slug: "",
    section_type: "general_info",
    content: "",
    display_order: 0,
    is_active: true,
    icon: "info",
    color_code: "#3B82F6",
  });

  // Load qualifications
  const loadQualifications = async () => {
    setLoading(true);
    try {
    //   console.log("API_BASE_URL:", API_BASE_URL);
    //   console.log("API_KEY:", API_KEY);
    //   console.log("Full URL:", `${API_BASE_URL}?action=getStudentFinanceQualifications`);
      
      const response = await fetch(
        `${API_BASE_URL}?action=getStudentFinanceQualifications`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        }
      );

    //   console.log("Response status:", response.status);
      const result = await response.json();
    //   console.log("Result:", result);
      
      if (result.success) {
        setQualifications(result.data);
      } else {
       
        setNotification({
          type: 'error',
          message: 'Failed to load qualifications: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Failed to load qualifications:", error);
      setNotification({
        type: 'error',
        message: 'Network error: Unable to connect to the server.',
        duration: 4000
      });
    }
    setLoading(false);
  };

  // Load general info
  const loadGeneralInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}?action=getStudentFinanceGeneral`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setGeneralInfo(result.data);
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to load general info: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Failed to load general info:", error);
      setNotification({
        type: 'error',
        message: 'Network error: Unable to connect to the server.',
        duration: 4000
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'qualifications') {
      loadQualifications();
    } else {
      loadGeneralInfo();
    }
  }, [activeTab]);

  // Add new qualification
  const handleAddQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}?action=addFinanceQualification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(qualFormData),
      });

      const result = await response.json();
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Qualification added successfully!',
          duration: 4000
        });
        setShowAddForm(false);
        loadQualifications();
        resetQualForm();
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to add qualification: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error adding qualification:", error);
      setNotification({
        type: 'error',
        message: 'Network error while adding qualification.',
        duration: 4000
      });
    }
  };

  // Add new general info
  const handleAddGeneralInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}?action=addFinanceGeneralInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(genInfoFormData),
      });

      const result = await response.json();
      if (result.success) {
          setNotification({
                type: 'success',
                message: 'General information added successfully!',
                duration: 4000
            });
   
        setShowAddForm(false);
        loadGeneralInfo();
        resetGenInfoForm();
      } else {
   
        setNotification({
          type: 'error',
          message: 'Failed to add general info: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error adding general info:", error);
      setNotification({
        type: 'error',
        message: 'Network error while adding general information.',
        duration: 4000
      });
    }
  };

  // Update qualification
  const handleUpdateQualification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=updateFinanceQualification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ ...qualFormData, id: selectedItem.id }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Qualification updated successfully!");
        setShowEditModal(false);
        loadQualifications();
        setSelectedItem(null);
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to update: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error updating:", error);
      setNotification({
        type: 'error',
        message: 'Network error while updating qualification.',
        duration: 4000
      })
    }
  };

  // Update general info
  const handleUpdateGeneralInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=updateFinanceGeneralInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ ...genInfoFormData, id: selectedItem.id }),
      });

      const result = await response.json();
      if (result.success) {
        // alert("General information updated successfully!");
            setNotification({
                type: 'success',
                message: 'General information updated successfully!',
                duration: 4000
            });
        setShowEditModal(false);
        loadGeneralInfo();
        setSelectedItem(null);
      } else {
        setNotification({
                type: 'error',
                message: 'Failed to update general information: ' + (result.error || "Unknown error"),
                duration: 4000
            });
      }
    } catch (error) {
      console.error("Error updating:", error);
      setNotification({
        type: 'error',
        message: 'Network error while updating general information.',
        duration: 4000
      });
    }
  };

  // Delete qualification
  const handleDeleteQualification = async (id: number) => {
    if (!confirm("Are you sure you want to delete this qualification?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=deleteFinanceQualification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Deleted successfully!',
          duration: 4000
        });
        loadQualifications();
      } else {
        setNotification({
            type: 'error',
            message: 'Failed to delete: ' + (result.error || "Unknown error"),
            duration: 4000
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setNotification({
        type: 'error',
        message: 'Network error while deleting qualification.',
        duration: 4000
      });
    }
  };

  // Delete general info
  const handleDeleteGeneralInfo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=deleteFinanceGeneralInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Deleted successfully!',
          duration: 4000
        });
        loadGeneralInfo();
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to delete: ' + (result.error || "Unknown error"),
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setNotification({
        type: 'error',
        message: 'Network error while deleting general information.',
        duration: 4000
      });
    }
  };

  // Edit handlers
  const handleEditQualification = (qual: QualificationData) => {
    setSelectedItem(qual);
    setQualFormData(qual);
    setShowEditModal(true);
  };

  const handleEditGeneralInfo = (info: GeneralInfoData) => {
    setSelectedItem(info);
    setGenInfoFormData(info);
    setShowEditModal(true);
  };

  // Reset forms
  const resetQualForm = () => {
    setQualFormData({
      subject_name: "",
      subject_slug: "",
      category: "General",
      level_6_title: "",
      level_6_qualification: "",
      level_6_finance_eligible: true,
      level_7_title: "",
      level_7_qualification: "",
      level_7_finance_eligible: true,
      level_8_title: "",
      level_8_qualification: "",
      level_8_finance_eligible: true,
      professional_route: "",
      is_regulated: false,
      regulatory_body: "",
      special_notes: "",
      display_order: 0,
      is_active: true,
    });
  };

  const resetGenInfoForm = () => {
    setGenInfoFormData({
      section_title: "",
      section_slug: "",
      section_type: "general_info",
      content: "",
      display_order: 0,
      is_active: true,
      icon: "info",
      color_code: "#3B82F6",
    });
  };

  return (
    <div className="p-6">
         {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => setNotification(null)}
                />
            )}
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Student Finance Management
        </h1>
        <p className="text-gray-600">
          Manage UK qualification mapping and student finance eligibility information
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('qualifications')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'qualifications'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Subject Qualifications
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            General Information
          </button>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddForm(true);
            if (activeTab === 'qualifications') resetQualForm();
            else resetGenInfoForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {activeTab === 'qualifications' ? 'Qualification' : 'General Information'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Qualifications List */}
      {!loading && activeTab === 'qualifications' && (
        <div className="space-y-4">
          {qualifications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No qualifications found. Add your first one!</p>
            </div>
          ) : (
            qualifications.map((qual) => (
              <div key={qual.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{qual.subject_name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {qual.category}
                      </span>
                      {qual.is_regulated && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                          Regulated
                        </span>
                      )}
                      {!qual.is_active && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    {qual.regulatory_body && (
                      <p className="text-sm text-gray-500 mb-2">Regulatory Body: {qual.regulatory_body}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQualification(qual)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQualification(qual.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Level Information */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-700">Level 6</h4>
                      {qual.level_6_finance_eligible ? (
                        <span className="text-green-600 text-sm">✅ Funded</span>
                      ) : (
                        <span className="text-red-600 text-sm">❌ Not Funded</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{qual.level_6_title}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-700">Level 7</h4>
                      {qual.level_7_finance_eligible ? (
                        <span className="text-green-600 text-sm">✅ Funded</span>
                      ) : (
                        <span className="text-red-600 text-sm">❌ Not Funded</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{qual.level_7_title}</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-700">Level 8</h4>
                      {qual.level_8_finance_eligible ? (
                        <span className="text-green-600 text-sm">✅ Funded</span>
                      ) : (
                        <span className="text-red-600 text-sm">❌ Not Funded</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{qual.level_8_title}</p>
                  </div>
                </div>

                {/* Professional Route */}
                {qual.professional_route && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Professional Route:</p>
                    <p className="text-sm text-gray-600">{qual.professional_route}</p>
                  </div>
                )}

                {/* Special Notes */}
                {qual.special_notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Important Notes:</p>
                    <p className="text-sm text-gray-600">{qual.special_notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* General Information List */}
      {!loading && activeTab === 'general' && (
        <div className="space-y-4">
          {generalInfo.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No general information found. Add your first section!</p>
            </div>
          ) : (
            generalInfo.map((info) => (
              <div key={info.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{info.section_title}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {info.section_type.replace(/_/g, ' ')}
                      </span>
                      {!info.is_active && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGeneralInfo(info)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGeneralInfo(info.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{info.content}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
       <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Add {activeTab === 'qualifications' ? 'Qualification' : 'General Information'}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'qualifications' ? (
                <form onSubmit={handleAddQualification} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={qualFormData.subject_name}
                        onChange={(e) => setQualFormData({ ...qualFormData, subject_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={qualFormData.subject_slug}
                        onChange={(e) => setQualFormData({ ...qualFormData, subject_slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="e.g., law, business-economics"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={qualFormData.category}
                        onChange={(e) => setQualFormData({ ...qualFormData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={qualFormData.display_order}
                        onChange={(e) => setQualFormData({ ...qualFormData, display_order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                  </div>

                  {/* Level 6 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Level 6 (Bachelor's)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 6 Title
                        </label>
                        <input
                          type="text"
                          value={qualFormData.level_6_title}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_6_title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 6 Qualification Details
                        </label>
                        <textarea
                          value={qualFormData.level_6_qualification}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_6_qualification: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={qualFormData.level_6_finance_eligible}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_6_finance_eligible: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Student Finance Eligible
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Level 7 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Level 7 (Master's)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 7 Title
                        </label>
                        <input
                          type="text"
                          value={qualFormData.level_7_title}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_7_title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 7 Qualification Details
                        </label>
                        <textarea
                          value={qualFormData.level_7_qualification}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_7_qualification: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={qualFormData.level_7_finance_eligible}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_7_finance_eligible: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Student Finance Eligible
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Level 8 */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Level 8 (Doctorate)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 8 Title
                        </label>
                        <input
                          type="text"
                          value={qualFormData.level_8_title}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_8_title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Level 8 Qualification Details
                        </label>
                        <textarea
                          value={qualFormData.level_8_qualification}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_8_qualification: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-black"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={qualFormData.level_8_finance_eligible}
                          onChange={(e) => setQualFormData({ ...qualFormData, level_8_finance_eligible: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Student Finance Eligible
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Professional Route */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Route
                    </label>
                    <textarea
                      value={qualFormData.professional_route}
                      onChange={(e) => setQualFormData({ ...qualFormData, professional_route: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="e.g., LLB → SQE → Solicitor / Barrister"
                    />
                  </div>

                  {/* Regulation Information */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={qualFormData.is_regulated}
                        onChange={(e) => setQualFormData({ ...qualFormData, is_regulated: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Is Regulated Field
                      </label>
                    </div>
                    {qualFormData.is_regulated && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Regulatory Body
                        </label>
                        <input
                          type="text"
                          value={qualFormData.regulatory_body}
                          onChange={(e) => setQualFormData({ ...qualFormData, regulatory_body: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="e.g., NMC, SQE, HCPC"
                        />
                      </div>
                    )}
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Notes
                    </label>
                    <textarea
                      value={qualFormData.special_notes}
                      onChange={(e) => setQualFormData({ ...qualFormData, special_notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="Any important notes or warnings for students"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={qualFormData.is_active}
                      onChange={(e) => setQualFormData({ ...qualFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active (Display on student page)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Qualification
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddGeneralInfo} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={genInfoFormData.section_title}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, section_title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={genInfoFormData.section_slug}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, section_slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="e.g., funding-rules"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Type *
                      </label>
                      <select
                        required
                        value={genInfoFormData.section_type}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, section_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="funding_rules">Funding Rules</option>
                        <option value="progression_chart">Progression Chart</option>
                        <option value="general_info">General Info</option>
                        <option value="important_note">Important Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={genInfoFormData.display_order}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, display_order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      value={genInfoFormData.content}
                      onChange={(e) => setGenInfoFormData({ ...genInfoFormData, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-black"
                      placeholder="Enter content (supports line breaks and simple formatting)"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <input
                        type="text"
                        value={genInfoFormData.icon}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, icon: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="e.g., info, warning, chart"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Code
                      </label>
                      <input
                        type="color"
                        value={genInfoFormData.color_code}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, color_code: e.target.value })}
                        className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={genInfoFormData.is_active}
                      onChange={(e) => setGenInfoFormData({ ...genInfoFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500  text-black"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active (Display on student page)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add General Information
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Similar structure as Add Form */}
      {showEditModal && selectedItem && (
       <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit {activeTab === 'qualifications' ? 'Qualification' : 'General Information'}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'qualifications' ? (
                <form onSubmit={handleUpdateQualification} className="space-y-6">
                  {/* Same form fields as Add Form but with update handler */}
                  {/* (Including all fields from the add form) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={qualFormData.subject_name}
                        onChange={(e) => setQualFormData({ ...qualFormData, subject_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={qualFormData.subject_slug}
                        onChange={(e) => setQualFormData({ ...qualFormData, subject_slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                  </div>

                  {/* Include all other fields from the add form */}
                  
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update Qualification
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUpdateGeneralInfo} className="space-y-6">
                  {/* Same form fields as General Info Add Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={genInfoFormData.section_title}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, section_title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Type *
                      </label>
                      <select
                        required
                        value={genInfoFormData.section_type}
                        onChange={(e) => setGenInfoFormData({ ...genInfoFormData, section_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  text-black"
                      >
                        <option value="funding_rules">Funding Rules</option>
                        <option value="progression_chart">Progression Chart</option>
                        <option value="general_info">General Info</option>
                        <option value="important_note">Important Note</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      value={genInfoFormData.content}
                      onChange={(e) => setGenInfoFormData({ ...genInfoFormData, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-black"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update General Information
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFinancePage;
