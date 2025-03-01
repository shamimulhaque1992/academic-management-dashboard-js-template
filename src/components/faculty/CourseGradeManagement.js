'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CourseGradeManagement({ 
  courses, 
  selectedCourse, 
  onCourseChange, 
  enrollments, 
  students,
  onEnrollmentsChange,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Current enrollments:', enrollments);
    console.log('Selected course:', selectedCourse);
  }, [enrollments, selectedCourse]);

  // Get enrolled students for the selected course
  const enrolledStudents = enrollments
    .filter(enrollment => String(enrollment.courseId) === String(selectedCourse))
    .map(enrollment => {
      const student = students.find(s => String(s.id) === String(enrollment.studentId));
      if (student) {
        return {
          ...student,
          enrollmentId: enrollment.id,
          currentGrade: enrollment.grade || '-'
        };
      }
      return null;
    })
    .filter(Boolean);

  // Remove duplicates (keep latest enrollment)
  const uniqueStudents = Object.values(
    enrolledStudents.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {})
  );

  const handleGradeChange = async (enrollmentId, grade) => {
    try {
      await axios.patch(`http://localhost:3001/enrollments/${enrollmentId}`, { grade });
      if (onEnrollmentsChange) {
        await onEnrollmentsChange();
      }
      toast.success('Grade updated successfully');
    } catch (error) {
      toast.error('Failed to update grade');
    }
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="w-full max-w-md">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse || ''}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="w-full max-w-md">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse || ''}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update Grade</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueStudents.map((student) => (
              <tr key={student.enrollmentId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.currentGrade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => handleGradeChange(student.enrollmentId, e.target.value)}
                    className="block w-32 rounded-md border border-gray-300 py-1.5 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={student.currentGrade === '-' ? '' : student.currentGrade}
                  >
                    <option value="">Select Grade</option>
                    {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uniqueStudents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No students enrolled in this course</p>
        </div>
      )}
    </div>
  );
} 