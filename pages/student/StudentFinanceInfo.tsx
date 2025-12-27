import React, { useState, useEffect } from "react";
import { useProtectedRoute } from "../../lib/auth";
import Header from "@/components/nav";
import Footer from "@/components/footer";

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
}

interface GeneralInfoData {
  id: number;
  section_title: string;
  section_type: string;
  content: string;
  display_order: number;
  icon: string;
  color_code: string;
}

const StudentFinanceInfoPage: React.FC = () => {
  useProtectedRoute(['student', 'staff', 'admin', 'super_admin']);

  const [qualifications, setQualifications] = useState<QualificationData[]>([]);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set());

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [qualResp, genResp] = await Promise.all([
        fetch(`${API_BASE_URL}?action=getStudentFinanceQualifications&active=true`, {
          headers: { "X-API-KEY": API_KEY },
        }),
        fetch(`${API_BASE_URL}?action=getStudentFinanceGeneral&active=true`, {
          headers: { "X-API-KEY": API_KEY },
        }),
      ]);

      const qualResult = await qualResp.json();
      const genResult = await genResp.json();

      if (qualResult.success) {
        setQualifications(qualResult.data || []);
      }
      if (genResult.success) {
        setGeneralInfo(genResult.data || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(qualifications.map(q => q.category)))];

  // Filter qualifications
  const filteredQualifications = qualifications.filter(qual => {
    const matchesCategory = selectedCategory === "All" || qual.category === selectedCategory;
    const matchesSearch = qual.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qual.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle subject expansion
  const toggleSubject = (id: number) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubjects(newExpanded);
  };

  // Get icon for section type
  const getIconForSection = (type: string, icon: string) => {
    if (icon === 'chart') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      );
    } else if (icon === 'warning' || type === 'important_note') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            UK Student Finance & Qualification Guide
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive guide to UK qualification levels and Student Finance England eligibility
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* General Information Sections */}
            {generalInfo.length > 0 && (
              <div className="mb-8 space-y-4">
                {generalInfo.map((info) => (
                  <div
                    key={info.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border-l-4"
                    style={{ borderLeftColor: info.color_code }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div style={{ color: info.color_code }}>
                          {getIconForSection(info.section_type, info.icon)}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {info.section_title}
                        </h2>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                          {info.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subject Qualifications Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Subject-by-Subject Qualification Mapping
              </h2>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                  <svg
                    className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qualifications List */}
              <div className="space-y-4">
                {filteredQualifications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No qualifications found matching your criteria.</p>
                  </div>
                ) : (
                  filteredQualifications.map((qual) => (
                    <div
                      key={qual.id}
                      className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      {/* Subject Header - Clickable */}
                      <button
                        onClick={() => toggleSubject(qual.id)}
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {qual.subject_name}
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                              {qual.category}
                            </span>
                            {qual.is_regulated && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
                                ⚠️ Regulated
                              </span>
                            )}
                          </div>
                          {qual.regulatory_body && (
                            <p className="text-sm text-gray-600">
                              Regulated by: {qual.regulatory_body}
                            </p>
                          )}
                        </div>
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform ${
                            expandedSubjects.has(qual.id) ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded Content */}
                      {expandedSubjects.has(qual.id) && (
                        <div className="px-6 pb-6 space-y-4">
                          <div className="border-t border-gray-200 pt-4"></div>

                          {/* Level Information Grid */}
                          <div className="grid md:grid-cols-3 gap-4">
                            {/* Level 6 */}
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border-l-4 border-green-500">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-800">Level 6</h4>
                                {qual.level_6_finance_eligible ? (
                                  <span className="text-green-600 font-semibold text-sm">✅ Funded</span>
                                ) : (
                                  <span className="text-red-600 font-semibold text-sm">❌ Not Funded</span>
                                )}
                              </div>
                              <p className="text-gray-700 font-medium mb-2">{qual.level_6_title}</p>
                              <p className="text-sm text-gray-600">{qual.level_6_qualification}</p>
                            </div>

                            {/* Level 7 */}
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border-l-4 border-blue-500">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-800">Level 7</h4>
                                {qual.level_7_finance_eligible ? (
                                  <span className="text-green-600 font-semibold text-sm">✅ Funded</span>
                                ) : (
                                  <span className="text-red-600 font-semibold text-sm">❌ Not Funded</span>
                                )}
                              </div>
                              <p className="text-gray-700 font-medium mb-2">{qual.level_7_title}</p>
                              <p className="text-sm text-gray-600">{qual.level_7_qualification}</p>
                            </div>

                            {/* Level 8 */}
                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border-l-4 border-purple-500">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-800">Level 8</h4>
                                {qual.level_8_finance_eligible ? (
                                  <span className="text-green-600 font-semibold text-sm">✅ Funded</span>
                                ) : (
                                  <span className="text-red-600 font-semibold text-sm">❌ Not Funded</span>
                                )}
                              </div>
                              <p className="text-gray-700 font-medium mb-2">{qual.level_8_title}</p>
                              <p className="text-sm text-gray-600">{qual.level_8_qualification}</p>
                            </div>
                          </div>

                          {/* Professional Route */}
                          {qual.professional_route && (
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
                              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                Professional Route
                              </h4>
                              <p className="text-gray-700">{qual.professional_route}</p>
                            </div>
                          )}

                          {/* Special Notes */}
                          {qual.special_notes && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Important Information
                              </h4>
                              <p className="text-gray-700">{qual.special_notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Information */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need More Information?</h3>
              <p className="mb-4">
                For the most up-to-date information on Student Finance eligibility and application procedures, 
                please visit the official Student Finance England website or contact their helpline.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.gov.uk/student-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Visit Student Finance England
                </a>
                <a
                  href="https://www.ucas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Visit UCAS
                </a>
              </div>
            </div>
          </>
        )}
      </div>
        <Footer />
    </div>
  );
};

export default StudentFinanceInfoPage;
