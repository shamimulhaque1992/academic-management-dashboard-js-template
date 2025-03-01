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
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        }
      },
      animations: {
        enabled: true
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 7
          }
        }
      }]
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '12px'
      }
    },
    xaxis: {
      categories: enrollmentData.map(item => item.courseName),
      labels: {
        rotate: -45,
        trim: true,
        style: {
          fontSize: '10px',
          fontFamily: 'inherit'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Students',
        style: {
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          fontSize: '10px'
        }
      }
    },
    colors: ['#3B82F6', '#10B981'],
    title: {
      text: 'Course Enrollment Distribution',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: '600'
      }
    },
    legend: {
      position: 'top',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView('current')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Current Distribution
          </button>
          <button
            onClick={() => setSelectedView('trend')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
          className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>

      <div className="mt-4 -mx-2 sm:mx-0">
        <div className="w-full overflow-hidden">
          <div className="min-w-[300px]">
            <Chart
              options={{
                ...currentChartOptions,
                chart: {
                  ...currentChartOptions.chart,
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                      selection: false,
                      zoom: false,
                      zoomin: false,
                      zoomout: false,
                      pan: false,
                    }
                  }
                }
              }}
              series={currentSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Enrollment Summary</h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Active
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollmentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900 font-medium truncate max-w-[200px]">
                        {item.courseName}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">{item.enrollmentCount}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{item.activeStudents}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{item.completedStudents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 