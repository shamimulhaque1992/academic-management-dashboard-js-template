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
      height: 400,
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
        horizontal: true,
        barHeight: '70%',
        borderRadius: 4,
        dataLabels: {
          position: 'right'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(2);
      },
      style: {
        fontSize: '11px',
        fontFamily: 'inherit'
      }
    },
    xaxis: {
      categories: performanceData.courseWise?.map(course => course.courseName) || [],
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'inherit'
        }
      },
      title: {
        text: 'Average GPA',
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '10px'
        }
      }
    },
    colors: ['#3B82F6'],
    title: {
      text: 'Course Performance',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: '600'
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView('course')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'course'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Course Performance
          </button>
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                ...(selectedView === 'course' ? courseChartOptions : overallChartOptions),
                chart: {
                  ...(selectedView === 'course' ? courseChartOptions : overallChartOptions).chart,
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
              series={[{
                name: 'Average GPA',
                data: selectedView === 'course'
                  ? performanceData.courseWise?.map(course => course.averageGPA) || []
                  : performanceData.overall?.map(student => student.averageGPA) || []
              }]}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {selectedView === 'course' ? 'Course-wise Top Performers' : 'Overall Top Performers'}
        </h3>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {selectedView === 'course' ? (
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        GPA
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        GPA
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedView === 'course' ? (
                    performanceData.courseWise?.map((course, idx) => (
                      course.topStudents.map((student, studentIdx) => (
                        <tr key={`${idx}-${studentIdx}`} className="hover:bg-gray-50">
                          {studentIdx === 0 && (
                            <td className="px-3 py-2 text-sm text-gray-900 font-medium" rowSpan={course.topStudents.length}>
                              {course.courseName}
                            </td>
                          )}
                          <td className="px-3 py-2 text-sm text-gray-900">{student.studentName}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{student.grade}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{student.gpa.toFixed(2)}</td>
                        </tr>
                      ))
                    ))
                  ) : (
                    performanceData.overall?.map((student, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm text-gray-900">{student.studentName}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{student.studentId}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{student.enrollments}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{student.averageGPA.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 