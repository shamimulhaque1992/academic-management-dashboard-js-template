'use client';
import { useState } from 'react';
import { Edit, Trash2, Eye, Users } from 'lucide-react';
import Modal from '@/components/common/Modal';
import CourseForm from './CourseForm';
import CourseDetails from './CourseDetails';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CourseList({ courses, faculty, loading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleView = (course) => {
    setSelectedCourse(course);
    setIsDetailsOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:3001/courses/${courseId}`);
        toast.success('Course deleted successfully');
        // You might want to add a callback to refresh the courses list
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => {
                const facultyMember = faculty.find(f => f.id === course.facultyId);
                return (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {facultyMember?.name || 'Not Assigned'}
                        </div>
                        {facultyMember && (
                          <div className="text-sm text-gray-600">
                            {facultyMember.designation}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {course.enrollmentCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleView(course)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          title="Edit Course"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse ? "Edit Course" : "Add Course"}
      >
        <CourseForm
          course={selectedCourse}
          faculty={faculty}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Course Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Course Details"
      >
        <CourseDetails course={selectedCourse} faculty={faculty} />
      </Modal>
    </>
  );
} 