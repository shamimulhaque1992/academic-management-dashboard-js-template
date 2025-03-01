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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          axios.get('http://localhost:3001/courses'),
          axios.get('http://localhost:3001/enrollments')
        ]);

        const courses = coursesRes.data;
        const enrollments = enrollmentsRes.data;

        // Process data for visualization
        const processedData = courses.map(course => ({
          courseName: `${course.courseCode} - ${course.title}`,
          enrollmentCount: enrollments.filter(e => e.courseId === course.id).length
        }));

        setEnrollmentData(processedData);
      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    exportToCSV(enrollmentData, 'course_enrollments');
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400
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
    colors: ['#3B82F6'],
    title: {
      text: 'Course Enrollment Distribution',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    }
  };

  const series = [{
    name: 'Enrolled Students',
    data: enrollmentData.map(item => item.enrollmentCount)
  }];

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Enrollment Trends</h2>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={20} className="mr-2" />
          Export Data
        </button>
      </div>

      <div className="mt-4">
        <Chart
          options={chartOptions}
          series={series}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
} 