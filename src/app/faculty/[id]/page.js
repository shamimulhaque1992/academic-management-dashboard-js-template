'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Book, Users, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyDashboard({ params }) {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const [facultyRes, coursesRes, enrollmentsRes, studentsRes] = await Promise.all([
          axios.get(`http://localhost:3001/faculty/${params.id}`),
          axios.get('http://localhost:3001/courses'),
          axios.get('http://localhost:3001/enrollments'),
          axios.get('http://localhost:3001/students'),
        ]);

        setFaculty(facultyRes.data);
        const facultyCourses = coursesRes.data.filter(c => c.facultyId === parseInt(params.id));
        setCourses(facultyCourses);
        
        const courseEnrollments = enrollmentsRes.data.filter(e => 
          facultyCourses.some(c => c.id === e.courseId)
        );
        setEnrollments(courseEnrollments);
        
        setStudents(studentsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch faculty data');
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [params.id]);

  const calculateStats = () => {
    const totalStudents = new Set(enrollments.map(e => e.studentId)).size;
    const avgGrade = enrollments.reduce((acc, curr) => {
      const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
        'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0
      };
      return acc + (gradePoints[curr.grade] || 0);
    }, 0) / (enrollments.length || 1);

    return {
      totalCourses: courses.length,
      totalStudents,
      averageGrade: avgGrade.toFixed(2)
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!faculty) {
    return <div className="text-center py-8">Faculty member not found</div>;
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        {/* Faculty Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{faculty.name}</h1>
              <p className="text-gray-600">{faculty.designation}</p>
              <p className="text-gray-600">{faculty.email}</p>
              <p className="text-gray-600">Department: {faculty.department}</p>
              <p className="text-gray-600">Specialization: {faculty.specialization}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <Book className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center">
              <BarChart className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageGrade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map(course => {
                  const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                  const avgGrade = courseEnrollments.reduce((acc, curr) => {
                    const gradePoints = {
                      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
                      'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0
                    };
                    return acc + (gradePoints[curr.grade] || 0);
                  }, 0) / (courseEnrollments.length || 1);

                  return (
                    <tr key={course.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => router.push(`/courses/${course.id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap">{course.courseCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{courseEnrollments.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{avgGrade.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 