"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/nav';

/**
 * ========================================
 * OFQUAL-REGULATED COURSES OVERVIEW PAGE
 * ========================================
 * This page displays all Ofqual-regulated courses offered
 * including OTHM and QUALIFI qualifications from Level 3 to Level 8
 */

// SVG Icon Components
const icons = {
  business: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  health: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  hospitality: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  education: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  technology: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  safety: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  hr: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  finance: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  law: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  ai: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  check: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  graduation: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  trending: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  briefcase: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  globe: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Course data structure - Easy to edit
const courseLevels = [
  { level: "3", equivalent: "A-Level / UK College Diploma" },
  { level: "4", equivalent: "First year of a Bachelor's degree" },
  { level: "5", equivalent: "Second year of a Bachelor's degree / Foundation Degree" },
  { level: "6", equivalent: "Bachelor's degree" },
  { level: "7", equivalent: "Master's degree" },
  { level: "8", equivalent: "PhD / Research" },
];

const courseCategories = [
  {
    id: 1,
    name: "Business and Management",
    icon: icons.business,
    color: "blue",
    levels: [
      {
        level: "3",
        courses: [
          "Diploma in Business Management",
          "Extended Diploma in Business Management",
          "Diploma in Business Administration",
          "Extended Diploma in Business Administration"
        ]
      },
      {
        level: "4",
        courses: [
          "Diploma in Management and Leadership",
          "Extended Diploma in Management and Leadership",
          "Diploma in Business Management",
          "Extended Diploma in Business Management"
        ]
      },
      {
        level: "5",
        courses: [
          "Diploma in Strategic Management and Leadership",
          "Extended Diploma in Strategic Management and Leadership",
          "Diploma in Business Management",
          "Extended Diploma in Business Management"
        ]
      },
      {
        level: "7",
        courses: [
          "Diploma in Strategic Management and Leadership",
          "Extended Diploma in Strategic Management and Leadership",
          "Diploma in Business Management",
          "Extended Diploma in Business Management"
        ]
      }
    ],
    targetAudience: "Aspiring managers, team leaders, and executives seeking professional advancement"
  },
  {
    id: 2,
    name: "Health and Social Care",
    icon: icons.health,
    color: "green",
    levels: [
      {
        level: "4",
        courses: ["Diploma in Health and Social Care Management"]
      },
      {
        level: "5",
        courses: ["Diploma in Health and Social Care Leadership and Management"]
      },
      {
        level: "7",
        courses: ["Diploma in Strategic Management in Health and Social Care"]
      }
    ],
    targetAudience: "Healthcare professionals, social care managers, or those specializing in healthcare management"
  },
  {
    id: 3,
    name: "Hospitality and Tourism Management",
    icon: icons.hospitality,
    color: "purple",
    levels: [
      {
        level: "4",
        courses: ["Diploma in Hospitality and Tourism Management"]
      },
      {
        level: "5",
        courses: ["Diploma in Hospitality and Tourism Leadership and Management"]
      },
      {
        level: "7",
        courses: ["Diploma in Strategic Hospitality and Tourism Management"]
      }
    ],
    targetAudience: "Professionals in hotels, resorts, tourism boards, and leisure industry management"
  },
  {
    id: 4,
    name: "Education and Training",
    icon: icons.education,
    color: "yellow",
    levels: [
      {
        level: "4",
        courses: ["Diploma in Education and Training"]
      },
      {
        level: "5",
        courses: ["Diploma in Education and Training"]
      },
      {
        level: "7",
        courses: ["Diploma in Education Management"]
      }
    ],
    targetAudience: "Teachers, trainers, and educational leaders aiming to enhance professional practice and management skills"
  },
  {
    id: 5,
    name: "Information Technology (IT) & Computing",
    icon: icons.technology,
    color: "indigo",
    levels: [
      {
        level: "4",
        courses: ["Diploma in IT Systems and Management"]
      },
      {
        level: "5",
        courses: ["Diploma in IT Management"]
      },
      {
        level: "7",
        courses: ["Diploma in Strategic IT Management"]
      }
    ],
    targetAudience: "IT professionals, project managers, or those pursuing leadership roles in IT"
  },
  {
    id: 6,
    name: "Health and Safety Management",
    icon: icons.safety,
    color: "red",
    levels: [
      { level: "4", courses: ["Diploma in Health and Safety Management"] },
      { level: "5", courses: ["Diploma in Strategic Health and Safety Management"] },
      { level: "6", courses: ["Diploma in Advanced Health and Safety Management"] },
      { level: "7", courses: ["Diploma in Executive Health and Safety Leadership"] },
      { level: "8", courses: ["Research Diploma in Health and Safety"] }
    ],
    targetAudience: "Safety officers, compliance managers, and risk management professionals"
  },
  {
    id: 7,
    name: "Human Resource Management",
    icon: icons.hr,
    color: "pink",
    levels: [
      { level: "4", courses: ["Diploma in Human Resource Management"] },
      { level: "5", courses: ["Diploma in Strategic Human Resource Management"] },
      { level: "6", courses: ["Diploma in Advanced HR Management"] },
      { level: "7", courses: ["Diploma in Executive HR Leadership"] },
      { level: "8", courses: ["Research Diploma in Human Resource Management"] }
    ],
    targetAudience: "HR professionals, talent acquisition specialists, and organizational development experts"
  },
  {
    id: 8,
    name: "Accounting and Finance",
    icon: icons.finance,
    color: "emerald",
    levels: [
      { level: "4", courses: ["Diploma in Accounting and Finance"] },
      { level: "5", courses: ["Diploma in Financial Management"] },
      { level: "6", courses: ["Diploma in Advanced Financial Management"] },
      { level: "7", courses: ["Diploma in Strategic Finance and Investment"] },
      { level: "8", courses: ["Research Diploma in Accounting and Finance"] }
    ],
    targetAudience: "Accountants, financial analysts, and investment professionals"
  },
  {
    id: 9,
    name: "Law and Legal Services",
    icon: icons.law,
    color: "slate",
    levels: [
      { level: "4", courses: ["Diploma in Legal Studies"] },
      { level: "5", courses: ["Diploma in Legal Practice"] },
      { level: "6", courses: ["Diploma in Advanced Legal Studies"] },
      { level: "7", courses: ["Diploma in Strategic Legal Management"] },
      { level: "8", courses: ["Research Diploma in Law"] }
    ],
    targetAudience: "Legal practitioners, paralegals, and compliance officers"
  },
  {
    id: 10,
    name: "Data Science and Artificial Intelligence",
    icon: icons.ai,
    color: "cyan",
    levels: [
      { level: "4", courses: ["Diploma in Data Science Fundamentals"] },
      { level: "5", courses: ["Diploma in Applied Data Science"] },
      { level: "6", courses: ["Diploma in Advanced Data Science and AI"] },
      { level: "7", courses: ["Diploma in Strategic AI and Machine Learning"] },
      { level: "8", courses: ["Research Diploma in Artificial Intelligence"] }
    ],
    targetAudience: "Data analysts, AI engineers, and machine learning specialists"
  }
];

const keyFeatures = [
  {
    icon: icons.check,
    title: "Regulated by Ofqual",
    description: "Internationally recognized qualifications"
  },
  {
    icon: icons.graduation,
    title: "Flexible Delivery",
    description: "Classroom, online, or blended learning"
  },
  {
    icon: icons.document,
    title: "Practical Assessment",
    description: "Assignments, projects, and case studies (not solely exams)"
  },
  {
    icon: icons.trending,
    title: "Progression Opportunities",
    description: "Level 3 → Level 7 or direct entry to UK universities"
  },
  {
    icon: icons.briefcase,
    title: "Work-Based Learning",
    description: "Practical experience integrated into professional development"
  },
  {
    icon: icons.globe,
    title: "Global Recognition",
    description: "UK universities recognize Ofqual qualifications for top-up degrees and Master's programs"
  }
];

export default function OfqualCoursesOverview() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories based on search
  const filteredCategories = courseCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Color mapping for categories
  const colorClasses: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", hover: "hover:bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", hover: "hover:bg-green-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", hover: "hover:bg-purple-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", hover: "hover:bg-yellow-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", hover: "hover:bg-indigo-100" },
    red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", hover: "hover:bg-red-100" },
    pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", hover: "hover:bg-pink-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hover: "hover:bg-emerald-100" },
    slate: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", hover: "hover:bg-slate-100" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", hover: "hover:bg-cyan-100" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center">Ofqual-Regulated Courses</h1>
          <p className="text-xl text-center mb-6 text-blue-100">
            UK-Regulated Professional & Academic Credentials Recognized Globally
          </p>
          <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
            Regulated by the Office of Qualifications and Examinations Regulation (Ofqual) in England, 
            aligned with the Regulated Qualifications Framework (RQF)
          </p>
          
          {/* Apply Now Button */}
          <div className="text-center">
            <Link 
              href="/ofqual-courses/enrollment-form"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Qualification Levels Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Qualification Levels</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">UK Education Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courseLevels.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">Level {item.level}</td>
                    <td className="px-6 py-4 text-gray-700">{item.equivalent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
          Why Choose OTHM/QUALIFI Courses?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for courses (e.g., Business, IT, Health)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg text-black"
          />
        </div>
      </div>

      {/* Course Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
          Available Programs
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCategories.map((category) => {
            const colors = colorClasses[category.color];
            const isExpanded = selectedCategory === category.id;

            return (
              <div 
                key={category.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                {/* Category Header */}
                <div 
                  className={`${colors.bg} ${colors.border} border-b-2 p-6 cursor-pointer ${colors.hover}`}
                  onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={colors.text}>{category.icon}</div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>
                        {category.name}
                      </h3>
                    </div>
                    <button className={`${colors.text} text-2xl transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6">
                    {/* Target Audience */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Target Audience:</p>
                      <p className="text-gray-600">{category.targetAudience}</p>
                    </div>

                    {/* Courses by Level */}
                    <div className="space-y-4">
                      {category.levels.map((levelGroup, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Level {levelGroup.level} - {courseLevels.find(l => l.level === levelGroup.level)?.equivalent}
                          </h4>
                          <ul className="space-y-1">
                            {levelGroup.courses.map((course, courseIdx) => (
                              <li key={courseIdx} className="text-gray-700 flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>{course}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Apply Button */}
                    <div className="mt-6">
                      <Link
                        href={`/ofqual-courses/enrollment-form?category=${encodeURIComponent(category.name)}`}
                        className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Apply for {category.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Citiedge Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Citiedge International College Offers OTHM/QUALIFI Courses
          </h2>
          <div className="space-y-4 text-lg">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <p>Align with UK quality standards</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <p>Provide pathways to higher education (UK universities recognize Ofqual qualifications for top-up degrees and Master's programs)</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <p>Cater to international students seeking UK-recognized qualifications</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <p>Equip students with professional skills in management, healthcare, education, IT, and more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Apply now for our Ofqual-regulated courses and take the next step in your career
        </p>
        <Link 
          href="/ofqual-courses/enrollment-form"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
        >
          Complete Application Form →
        </Link>
      </div>
    </div>
  );
}
