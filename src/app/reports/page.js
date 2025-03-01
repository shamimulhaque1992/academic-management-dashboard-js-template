'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import EnrollmentTrends from '@/components/reports/EnrollmentTrends';
import TopPerformers from '@/components/reports/TopPerformers';
import { exportToCSV } from '@/utils/exportUtils';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('enrollments');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'enrollments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Course Enrollments
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Top Performers
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'enrollments' ? (
          <EnrollmentTrends />
        ) : (
          <TopPerformers />
        )}
      </div>
    </div>
  );
} 