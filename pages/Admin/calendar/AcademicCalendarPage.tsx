import React, { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string

interface CalendarEvent {
  id: number;
  event_title: string;
  event_type: string;
  entry_point: string;
  programme_level: string;
  start_date: string;
  end_date: string;
  description: string;
  location: string;
  is_mandatory: boolean;
  ukvi_monitored: boolean;
  requires_attendance: boolean;
  status: string;
  display_order: number;
  color_code: string;
}

const AcademicCalendarPage: React.FC = () => {
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterEntryPoint, setFilterEntryPoint] = useState<string>("all");
  const [filterEventType, setFilterEventType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("upcoming");

  const [formData, setFormData] = useState({
    event_title: "",
    event_type: "teaching",
    entry_point: "all",
    programme_level: "All",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    is_mandatory: false,
    ukvi_monitored: false,
    requires_attendance: false,
    status: "upcoming",
    display_order: 0,
    color_code: "#3B82F6",
  });

  // Fetch calendar events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterEntryPoint !== "all") params.append("entry_point", filterEntryPoint);
      if (filterEventType) params.append("event_type", filterEventType);

      const response = await fetch(
        `${API_BASE_URL}?action=getAcademicCalendar&${params.toString()}`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error("API Error:", result.error);
        alert("Failed to load events: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      alert("Network error: Unable to connect to the server. Please check if the API is accessible.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [filterEntryPoint, filterEventType, filterStatus]);

  // Add new event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}?action=addCalendarEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        loadEvents();
        setShowAddForm(false);
        resetForm();
        alert("Event added successfully!");
      } else {
        alert("Failed to add event: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to add event:", error);
      alert("Network error: Unable to add event. Please try again.");
    }
  };

  // Update event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=updateCalendarEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ ...formData, id: selectedEvent.id }),
      });

      const result = await response.json();
      if (result.success) {
        loadEvents();
        setShowEditModal(false);
        setSelectedEvent(null);
        resetForm();
        alert("Event updated successfully!");
      } else {
        alert("Failed to update event: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Network error: Unable to update event. Please try again.");
    }
  };

  // Delete event
  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}?action=deleteCalendarEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        loadEvents();
        alert("Event deleted successfully!");
      } else {
        alert("Failed to delete event: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Network error: Unable to delete event. Please try again.");
    }
  };

  // Open edit modal
  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      event_title: event.event_title,
      event_type: event.event_type,
      entry_point: event.entry_point,
      programme_level: event.programme_level,
      start_date: event.start_date,
      end_date: event.end_date,
      description: event.description,
      location: event.location,
      is_mandatory: event.is_mandatory,
      ukvi_monitored: event.ukvi_monitored,
      requires_attendance: event.requires_attendance,
      status: event.status,
      display_order: event.display_order,
      color_code: event.color_code,
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      event_title: "",
      event_type: "teaching",
      entry_point: "all",
      programme_level: "All",
      start_date: "",
      end_date: "",
      description: "",
      location: "",
      is_mandatory: false,
      ukvi_monitored: false,
      requires_attendance: false,
      status: "upcoming",
      display_order: 0,
      color_code: "#3B82F6",
    });
  };

  // Get event type badge color
  const getEventTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      arrival: "bg-purple-100 text-purple-800",
      enrolment: "bg-blue-100 text-blue-800",
      teaching: "bg-green-100 text-green-800",
      assessment: "bg-red-100 text-red-800",
      vacation: "bg-yellow-100 text-yellow-800",
      resit: "bg-orange-100 text-orange-800",
      progression: "bg-indigo-100 text-indigo-800",
      supervision: "bg-pink-100 text-pink-800",
    };
    return badges[type] || "bg-gray-100 text-gray-800";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Academic Calendar Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage academic events and UKVI compliance dates</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black">Entry Point</label>
            <select
              value={filterEntryPoint}
              onChange={(e) => setFilterEntryPoint(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="all">All Entry Points</option>
              <option value="january_2026">January 2026</option>
              <option value="march_2026">March 2026</option>
              <option value="september_2026">September 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black" >Event Type</label>
            <select
              value={filterEventType}
              onChange={(e) => setFilterEventType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">All Event Types</option>
              <option value="arrival">Arrival</option>
              <option value="enrolment">Enrolment</option>
              <option value="teaching">Teaching</option>
              <option value="assessment">Assessment</option>
              <option value="vacation">Vacation</option>
              <option value="resit">Resit</option>
              <option value="progression">Progression</option>
              <option value="supervision">Supervision</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              style={{ borderLeftWidth: "4px", borderLeftColor: event.color_code }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{event.event_title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeBadge(event.event_type)}`}>
                      {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                    </span>
                    {event.ukvi_monitored && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        UKVI Monitored
                      </span>
                    )}
                    {event.is_mandatory && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Entry Point</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {event.entry_point.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Programme Level</p>
                      <p className="text-sm font-medium text-gray-900">{event.programme_level}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(event.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(event.end_date)}</p>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mt-3">{event.description}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No events found. Add your first event to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddForm || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {showEditModal ? "Edit Event" : "Add New Event"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditModal(false);
                  setSelectedEvent(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={showEditModal ? handleUpdateEvent : handleAddEvent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.event_title}
                    onChange={(e) => setFormData({ ...formData, event_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="arrival">Arrival</option>
                    <option value="enrolment">Enrolment</option>
                    <option value="teaching">Teaching</option>
                    <option value="assessment">Assessment</option>
                    <option value="vacation">Vacation</option>
                    <option value="resit">Resit</option>
                    <option value="progression">Progression</option>
                    <option value="supervision">Supervision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Point *</label>
                  <select
                    value={formData.entry_point}
                    onChange={(e) => setFormData({ ...formData, entry_point: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="all">All Entry Points</option>
                    <option value="january_2026">January 2026</option>
                    <option value="march_2026">March 2026</option>
                    <option value="september_2026">September 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Programme Level</label>
                  <input
                    type="text"
                    value={formData.programme_level}
                    onChange={(e) => setFormData({ ...formData, programme_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., All, BSc (Level 6), MSc (Level 7)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Main Campus, Online"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
                  <input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_mandatory}
                      onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mandatory Attendance</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.ukvi_monitored}
                      onChange={(e) => setFormData({ ...formData, ukvi_monitored: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">UKVI Monitored Event</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.requires_attendance}
                      onChange={(e) => setFormData({ ...formData, requires_attendance: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Requires Attendance Tracking</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  {showEditModal ? "Update Event" : "Add Event"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCalendarPage;
