'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';
import EnrollmentTrends from '@/components/reports/EnrollmentTrends';
import TopPerformers from '@/components/reports/TopPerformers';
import { exportToCSV } from '@/utils/exportUtils';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('enrollments');

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 px-2">Analytics & Reports</h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
          <nav className="flex space-x-4 md:space-x-8 min-w-max px-2">
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`py-2 md:py-4 px-2 md:px-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                activeTab === 'enrollments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Course Enrollments
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-2 md:py-4 px-2 md:px-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Top Performers
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
          {activeTab === 'enrollments' ? (
            <EnrollmentTrends />
          ) : (
            <TopPerformers />
          )}
        </div>
      </div>
    </div>
  );
} 