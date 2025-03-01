'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/exportUtils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function TopPerformers() {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedView, setSelectedView] = useState('course');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/courses'),
          axios.get('http://localhost:3001/enrollments')
        ]);

        const students = studentsRes.data;
        const courses = coursesRes.data;
        const enrollments = enrollmentsRes.data;

        // Process data for visualization
        const processedData = courses.map(course => {
          const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
          const topStudents = courseEnrollments
            .map(enrollment => {
              const student = students.find(s => s.id === enrollment.studentId);
              return {
                studentName: student ? student.name : 'Unknown',
                grade: enrollment.grade,
                gpa: student ? student.gpa : 0
              };
            })
            .sort((a, b) => b.gpa - a.gpa)
            .slice(0, 5);

          return {
            courseName: `${course.courseCode} - ${course.title}`,
            topStudents
          };
        });

        setPerformanceData(processedData);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = performanceData.flatMap(course => 
      course.topStudents.map(student => ({
        Course: course.courseName,
        Student: student.studentName,
        GPA: student.gpa,
        Grade: student.grade
      }))
    );
    exportToCSV(exportData, 'top_performers');
  };

  const chartOptions = {
    chart: {
      type: 'heatmap',
      height: 450
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 2, color: '#FF4560' },
            { from: 2, to: 3, color: '#FEB019' },
            { from: 3, to: 3.5, color: '#00E396' },
            { from: 3.5, to: 4, color: '#008FFB' }
          ]
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      }
    },
    title: {
      text: 'Top Performing Students by Course',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    },
    xaxis: {
      type: 'category'
    }
  };

  const series = performanceData.map(course => ({
    name: course.courseName,
    data: course.topStudents.map(student => ({
      x: student.studentName,
      y: student.gpa
    }))
  }));

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Top Performing Students</h2>
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
          type="heatmap"
          height={450}
        />
      </div>
    </div>
  );
} 