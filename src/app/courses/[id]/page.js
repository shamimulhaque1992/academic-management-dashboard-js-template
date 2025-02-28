'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Users, GraduationCap, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseDetails({ params }) {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, enrollmentsRes, studentsRes, facultyRes] = await Promise.all([
          axios.get(`http://localhost:3001/courses/${params.id}`),
          axios.get(`http://localhost:3001/enrollments?courseId=${params.id}`),
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/faculty'),
        ]);

        setCourse(courseRes.data);
        setEnrollments(enrollmentsRes.data);
        setStudents(studentsRes.data);
        setFaculty(facultyRes.data.find(f => f.id === courseRes.data.facultyId));
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch course data');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [params.id]);

  const calculateGradeDistribution = () => {
    const distribution = enrollments.reduce((acc, curr) => {
      acc[curr.grade] = (acc[curr.grade] || 0) + 1;
      return acc;
    }, {});

    return distribution;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-8">Course not found</div>;
  }

  const enrolledStudents = students.filter(student => 
    enrollments.some(e => e.studentId === student.id)
  );

  const gradeDistribution = calculateGradeDistribution();

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

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600">Course Code: {course.courseCode}</p>
              <p className="text-gray-600">Credits: {course.credits}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">Enrollment</p>
              <p className="text-3xl font-bold text-blue-600">{enrolledStudents.length}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faculty Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GraduationCap className="mr-2" size={24} />
              Course Instructor
            </h2>
            {faculty ? (
              <div>
                <p className="font-medium text-lg">{faculty.name}</p>
                <p className="text-gray-600">{faculty.designation}</p>
                <p className="text-gray-600">{faculty.email}</p>
                <p className="text-gray-600">Specialization: {faculty.specialization}</p>
              </div>
            ) : (
              <p className="text-gray-600">No instructor assigned</p>
            )}
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="mr-2" size={24} />
              Grade Distribution
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Grade {grade}</span>
                  <span className="text-gray-600">{count} students</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" size={24} />
              Enrolled Students ({enrolledStudents.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map(student => {
                    const enrollment = enrollments.find(e => e.studentId === student.id);
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium
                            ${enrollment?.grade === 'A' ? 'bg-green-100 text-green-800' :
                              enrollment?.grade === 'F' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'}`}>
                            {enrollment?.grade || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {enrollment?.semester}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 