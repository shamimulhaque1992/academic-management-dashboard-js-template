'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/exportUtils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function TopPerformers() {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedView, setSelectedView] = useState('course'); // 'course' or 'overall'
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

        // Calculate GPA for each grade
        const gradePoints = {
          'A': 4.0, 'A-': 3.7,
          'B+': 3.3, 'B': 3.0, 'B-': 2.7,
          'C+': 2.3, 'C': 2.0, 'C-': 1.7,
          'D+': 1.3, 'D': 1.0, 'F': 0.0
        };

        // Process course-wise performance
        const coursePerformance = courses.map(course => {
          const courseEnrollments = enrollments.filter(e => e.courseId === course.id && e.grade);
          const studentPerformances = courseEnrollments.map(enrollment => {
            const student = students.find(s => s.id === enrollment.studentId);
            return {
              studentName: student ? student.name : 'Unknown',
              studentId: student ? student.studentId : 'N/A',
              grade: enrollment.grade,
              gpa: gradePoints[enrollment.grade] || 0
            };
          }).sort((a, b) => b.gpa - a.gpa).slice(0, 5);

          return {
            courseName: `${course.courseCode} - ${course.title}`,
            topStudents: studentPerformances,
            averageGPA: studentPerformances.reduce((acc, curr) => acc + curr.gpa, 0) / 
                       (studentPerformances.length || 1)
          };
        });

        // Calculate overall top performers
        const studentPerformance = students.map(student => {
          const studentEnrollments = enrollments.filter(e => e.studentId === student.id && e.grade);
          const totalGPA = studentEnrollments.reduce((acc, curr) => acc + (gradePoints[curr.grade] || 0), 0);
          const averageGPA = totalGPA / (studentEnrollments.length || 1);
          
          return {
            studentName: student.name,
            studentId: student.studentId,
            enrollments: studentEnrollments.length,
            averageGPA: averageGPA
          };
        }).sort((a, b) => b.averageGPA - a.averageGPA).slice(0, 10);

        setPerformanceData({
          courseWise: coursePerformance,
          overall: studentPerformance
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = selectedView === 'course' 
      ? performanceData.courseWise.flatMap(course => 
          course.topStudents.map(student => ({
            'Course': course.courseName,
            'Student Name': student.studentName,
            'Student ID': student.studentId,
            'Grade': student.grade,
            'GPA': student.gpa
          }))
        )
      : performanceData.overall.map(student => ({
          'Student Name': student.studentName,
          'Student ID': student.studentId,
          'Courses Completed': student.enrollments,
          'Average GPA': student.averageGPA.toFixed(2)
        }));

    exportToCSV(exportData, 'top_performers');
  };

  const courseChartOptions = {
    chart: {
      type: 'bar',
      height: 400
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(2);
      }
    },
    xaxis: {
      categories: performanceData.courseWise?.map(course => course.courseName) || [],
      title: {
        text: 'Average GPA'
      }
    },
    yaxis: {
      title: {
        text: 'Courses'
      }
    },
    colors: ['#3B82F6'],
    title: {
      text: 'Course-wise Performance (Average GPA)',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    }
  };

  const overallChartOptions = {
    chart: {
      type: 'bar',
      height: 400
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(2);
      }
    },
    xaxis: {
      categories: performanceData.overall?.map(student => student.studentName) || [],
      title: {
        text: 'Average GPA'
      }
    },
    yaxis: {
      title: {
        text: 'Students'
      }
    },
    colors: ['#10B981'],
    title: {
      text: 'Top Performing Students (Overall GPA)',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button
            onClick={() => setSelectedView('course')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'course'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Course Performance
          </button>
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-4 py-2 rounded-lg ${
              selectedView === 'overall'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overall Performance
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
        <Chart
          options={selectedView === 'course' ? courseChartOptions : overallChartOptions}
          series={[{
            name: 'Average GPA',
            data: selectedView === 'course'
              ? performanceData.courseWise?.map(course => course.averageGPA) || []
              : performanceData.overall?.map(student => student.averageGPA) || []
          }]}
          type="bar"
          height={400}
        />
      </div>

      {/* Detailed Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          {selectedView === 'course' ? 'Course-wise Top Performers' : 'Overall Top Performers'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {selectedView === 'course' ? (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average GPA
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedView === 'course' ? (
                performanceData.courseWise?.map((course, idx) => (
                  course.topStudents.map((student, studentIdx) => (
                    <tr key={`${idx}-${studentIdx}`}>
                      {studentIdx === 0 && (
                        <td className="px-6 py-4 whitespace-nowrap" rowSpan={course.topStudents.length}>
                          {course.courseName}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.gpa.toFixed(2)}</td>
                    </tr>
                  ))
                ))
              ) : (
                performanceData.overall?.map((student, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.enrollments}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.averageGPA.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 