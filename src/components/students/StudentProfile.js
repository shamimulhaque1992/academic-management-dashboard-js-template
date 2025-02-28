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
    return <div className="text-center py-4">Loading...</div>;
  }

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses?.includes(course.id)
  );

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-medium">{student.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{student.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{student.phone}</p>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Academic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="font-medium">Year {student.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">GPA</p>
            <p className="font-medium">{student.gpa.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Enrolled Courses</h3>
        <div className="space-y-3">
          {enrolledCourses.map(course => {
            const enrollment = enrollments.find(e => e.courseId === course.id);
            return (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Book className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
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
          })}
        </div>
      </div>
    </div>
  );
} 