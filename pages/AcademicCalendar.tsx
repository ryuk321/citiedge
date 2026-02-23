import React, { useState, useEffect } from "react";
import "../app/globals.css";
import Header from "@/components/nav";
import Footer from "@/components/footer";

// API Configuration
const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';
const API_KEY = 'super-secret-key';

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

interface GroupedEvents {
  [key: string]: CalendarEvent[];
}

const AcademicCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntryPoint, setSelectedEntryPoint] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<"timeline" | "grouped">("timeline");

  // Fetch calendar events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "upcoming");
      if (selectedEntryPoint !== "all") {
        params.append("entry_point", selectedEntryPoint);
      }

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
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      // Silently fail for public page - just show empty state
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [selectedEntryPoint]);

  // Group events by entry point
  const groupedEvents: GroupedEvents = events.reduce((acc, event) => {
    const key = event.entry_point;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as GroupedEvents);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatDate(start);
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Get event icon
  const getEventIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      arrival: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      enrolment: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      teaching: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      assessment: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      vacation: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      resit: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      progression: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      supervision: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.teaching;
  };

  // Get entry point display name
  const getEntryPointName = (entryPoint: string) => {
    const names: Record<string, string> = {
      january_2026: "January 2026",
      march_2026: "March 2026",
      september_2026: "September 2026",
      all: "All Entry Points",
    };
    return names[entryPoint] || entryPoint;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Header />
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
              Proposed Academic Calendar
            </h1>
            <p className="text-xl text-blue-100 mb-2">Academic Year: January 2026 – August 2027</p>
            <p className="text-lg text-blue-200 mb-8">
              CITIEDGE INTERNATIONAL COLLEGE LONDON
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
              <span className="px-4 py-2 bg-blue-800/50 rounded-full backdrop-blur-sm">
                UKVI Student Sponsor Guidance Aligned
              </span>
              <span className="px-4 py-2 bg-blue-800/50 rounded-full backdrop-blur-sm">
                Multiple Entry Points Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-wrap">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black">Entry Point</label>
                <select
                  value={selectedEntryPoint}
                  onChange={(e) => setSelectedEntryPoint(e.target.value)}
                 className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-black"
                >
                  <option value="all">All Entry Points</option>
                  <option value="january_2026">January 2026</option>
                  <option value="march_2026">March 2026</option>
                  <option value="september_2026">September 2026</option>
                     <option value="january_2026">January 2027</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedView("timeline")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedView === "timeline"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setSelectedView("grouped")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedView === "grouped"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Grouped
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                <p className="text-sm text-gray-500">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        ) : selectedView === "timeline" ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderLeftWidth: "6px", borderLeftColor: event.color_code }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: event.color_code + "20", color: event.color_code }}
                    >
                      {getEventIcon(event.event_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.event_title}</h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              {getEntryPointName(event.entry_point)}
                            </span>
                            {event.ukvi_monitored && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 animate-pulse">
                                🛂 UKVI Monitored
                              </span>
                            )}
                            {event.is_mandatory && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                                ⚠️ Mandatory
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDateRange(event.start_date, event.end_date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Programme</p>
                            <p className="text-sm font-semibold text-gray-900">{event.programme_level}</p>
                          </div>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                              <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-500">
                    There are currently no upcoming events for the selected entry point.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([entryPoint, entryEvents]) => (
              <div key={entryPoint} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">{getEntryPointName(entryPoint)}</h2>
                  <p className="text-blue-100 text-sm mt-1">{entryEvents.length} events</p>
                </div>

                <div className="p-6 space-y-4">
                  {entryEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all hover:shadow-lg"
                      style={{ borderLeftWidth: "4px", borderLeftColor: event.color_code }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: event.color_code + "20", color: event.color_code }}
                          >
                            {getEventIcon(event.event_type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{event.event_title}</h4>
                            <p className="text-sm text-gray-600">{formatDateRange(event.start_date, event.end_date)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {event.ukvi_monitored && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              UKVI
                            </span>
                          )}
                          {event.is_mandatory && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              Mandatory
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Programme Levels</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Diploma (RQF Level 4/5)</li>
                <li>• BSc / Undergraduate (RQF Level 6)</li>
                <li>• MSc / Postgraduate Taught (RQF Level 7)</li>
                <li>• PhD / Doctoral (RQF Level 8)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Entry Points</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• January 2026 - Proposed Structured Entry</li>
                <li>• March 2026 - Approved Spring Entry</li>
                <li>• September 2026 - Approved Autumn Entry</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">UKVI Compliance</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                All academic activities are monitored in accordance with UK Student Sponsor Guidance. 
                Attendance and academic engagement are tracked throughout all teaching periods.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AcademicCalendar;
