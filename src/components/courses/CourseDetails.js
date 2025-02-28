'use client';
import { useState, useEffect } from 'react';
import { Users, Book, GraduationCap } from 'lucide-react';
import axios from 'axios';

export default function CourseDetails({ course, faculty }) {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      if (course) {
        try {
          const response = await axios.get(`http://localhost:3001/students?enrolledCourses=${course.id}`);
          setEnrolledStudents(response.data);
        } catch (error) {
          console.error('Error fetching enrolled students:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledStudents();
  }, [course]);

  if (!course) return null;

  const facultyMember = faculty.find(f => f.id === course.facultyId);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{course.courseCode}</h3>
        <p className="text-xl font-bold text-gray-900">{course.title}</p>
      </div>

      {/* Course Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="h-5 w-5 mr-2" />
            <span>Credits: {course.credits}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>Enrollment: {course.enrollmentCount} / {course.maxEnrollment}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Book className="h-5 w-5 mr-2" />
            <span>Department: {course.department}</span>
          </div>
        </div>

        {/* Faculty Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Faculty</h4>
          {facultyMember ? (
            <div>
              <p className="text-sm font-semibold">{facultyMember.name}</p>
              <p className="text-sm text-gray-600">{facultyMember.designation}</p>
              <p className="text-sm text-gray-600">{facultyMember.email}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not assigned</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
        <p className="text-sm text-gray-600">{course.description}</p>
      </div>

      {/* Syllabus */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Syllabus</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 whitespace-pre-line">{course.syllabus}</p>
        </div>
      </div>

      {/* Enrolled Students */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Enrolled Students ({enrolledStudents.length})
        </h4>
        {loading ? (
          <p className="text-sm text-gray-500">Loading students...</p>
        ) : (
          <div className="bg-white rounded-lg border max-h-60 overflow-y-auto">
            {enrolledStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {enrolledStudents.map(student => (
                  <li key={student.id} className="p-3 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.studentId} • GPA: {student.gpa}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-gray-500">No students enrolled yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 