import React, { useState, useEffect } from 'react';

interface ClassesProps {
  studentId: number;
}

interface ClassInfo {
  id: number;
  name: string;
  code: string;
  instructor: string;
  schedule: string;
  room: string;
  status: 'active' | 'completed' | 'upcoming';
}

export default function Classes({ studentId }: ClassesProps) {
  const [classes, setClasses] = useState<ClassInfo[]>([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      code: 'CS101',
      instructor: 'Dr. Sarah Johnson',
      schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
      room: 'Room 301',
      status: 'active'
    },
    {
      id: 2,
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      instructor: 'Prof. Michael Chen',
      schedule: 'Tue, Thu 2:00 PM - 3:30 PM',
      room: 'Room 205',
      status: 'active'
    },
    {
      id: 3,
      name: 'Web Development',
      code: 'CS301',
      instructor: 'Dr. Emily Brown',
      schedule: 'Fri 9:00 AM - 12:00 PM',
      room: 'Lab 102',
      status: 'active'
    }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Classes</h1>
        <p className="text-slate-500">View your enrolled courses and schedules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="text-sm text-blue-600 mb-1">Active Classes</div>
          <div className="text-3xl font-bold text-blue-900">
            {classes.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <div className="text-sm text-green-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-900">
            {classes.filter(c => c.status === 'completed').length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <div className="text-sm text-purple-600 mb-1">Total Credits</div>
          <div className="text-3xl font-bold text-purple-900">45</div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {classes.map((classInfo) => (
          <div key={classInfo.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{classInfo.name}</h3>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    {classInfo.code}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {classInfo.instructor}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {classInfo.schedule}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {classInfo.room}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                classInfo.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : classInfo.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {classInfo.status ? classInfo.status.charAt(0).toUpperCase() + classInfo.status.slice(1) : 'Unknown'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Materials
              </button>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Assignments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
