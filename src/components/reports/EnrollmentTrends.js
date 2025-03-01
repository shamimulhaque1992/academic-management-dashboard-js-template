'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/exportUtils';

// Import ApexCharts dynamically to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function EnrollmentTrends() {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [timeframeData, setTimeframeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('current'); // 'current' or 'trend'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          axios.get('http://localhost:3001/courses'),
          axios.get('http://localhost:3001/enrollments')
        ]);

        const courses = coursesRes.data;
        const enrollments = enrollmentsRes.data;

        // Process current enrollment data
        const currentData = courses.map(course => {
          const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
          return {
            courseName: `${course.courseCode} - ${course.title}`,
            enrollmentCount: courseEnrollments.length,
            activeStudents: courseEnrollments.filter(e => !e.grade).length,
            completedStudents: courseEnrollments.filter(e => e.grade).length
          };
        });

        // Process time-based enrollment data (simulated for demo)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const timeData = courses.map(course => ({
          name: course.courseCode,
          data: months.map(() => Math.floor(Math.random() * 30 + 10)) // Simulated data
        }));

        setEnrollmentData(currentData);
        setTimeframeData(timeData);
      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = enrollmentData.map(item => ({
      'Course': item.courseName,
      'Total Enrollments': item.enrollmentCount,
      'Active Students': item.activeStudents,
      'Completed': item.completedStudents
    }));
    exportToCSV(exportData, 'course_enrollments');
  };

  const currentChartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: enrollmentData.map(item => item.courseName),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Students'
      }
    },
    colors: ['#3B82F6', '#10B981'],
    title: {
      text: 'Current Course Enrollment Distribution',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const trendChartOptions = {
    chart: {
      type: 'line',
      height: 400
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Enrollments'
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    title: {
      text: 'Enrollment Trends Over Time',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const currentSeries = [
    {
      name: 'Active Students',
      data: enrollmentData.map(item => item.activeStudents)
    },
    {
      name: 'Completed',
      data: enrollmentData.map(item => item.completedStudents)
    }
  ];

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button
            onClick={() => setSelectedView('current')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Current Distribution
          </button>
          <button
            onClick={() => setSelectedView('trend')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'trend'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Enrollment Trends
          </button>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={20} className="mr-2" />
          Export Data
        </button>
      </div>

      <div className="mt-4">
        {selectedView === 'current' ? (
          <Chart
            options={currentChartOptions}
            series={currentSeries}
            type="bar"
            height={400}
          />
        ) : (
          <Chart
            options={trendChartOptions}
            series={timeframeData}
            type="line"
            height={400}
          />
        )}
      </div>

      {/* Summary Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Enrollment Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollmentData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.enrollmentCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.activeStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.completedStudents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 