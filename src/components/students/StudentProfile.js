'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, GraduationCap, Calendar } from 'lucide-react';

export default function StudentProfile({ student }) {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [enrollmentsRes, coursesRes] = await Promise.all([
          axios.get(`http://localhost:3001/enrollments?studentId=${student.id}`),
          axios.get('http://localhost:3001/courses')
        ]);
        setEnrollments(enrollmentsRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [student.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses?.includes(course.id)
  );

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Info */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Student ID</p>
            <p className="mt-1 text-base text-gray-800">{student.studentId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="mt-1 text-base text-gray-800">{student.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="mt-1 text-base text-gray-800">{student.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="mt-1 text-base text-gray-800">{student.phone}</p>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Year</p>
            <p className="mt-1 text-base text-gray-800">Year {student.year}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">GPA</p>
            <p className="mt-1">
              <span className={`px-2 py-1 text-sm font-medium rounded-full
                ${student.gpa >= 3.5 ? 'bg-green-100 text-green-800' : 
                  student.gpa >= 3.0 ? 'bg-blue-100 text-blue-800' :
                  student.gpa >= 2.0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {student.gpa.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrolled Courses</h3>
        <div className="space-y-3">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => {
              const enrollment = enrollments.find(e => e.courseId === course.id);
              return (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Book className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.courseCode}</p>
                    </div>
                  </div>
                  {enrollment && (
                    <span className={`px-2 py-1 text-sm font-medium rounded-full
                      ${enrollment.grade === 'A' ? 'bg-green-100 text-green-800' :
                        enrollment.grade === 'F' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {enrollment.grade}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No courses enrolled</p>
          )}
        </div>
      </div>
    </div>
  );
} 