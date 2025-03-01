'use client';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCourses } from '@/redux/features/courseSlice';
import toast from 'react-hot-toast';

export default function CourseForm({ course, faculty, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    description: '',
    credits: 3,
    facultyId: '',
    department: 'CSE',
    maxEnrollment: 60,
    prerequisites: [],
    syllabus: '',
    enrollmentCount: 0
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (course) {
        await axios.put(`http://localhost:3001/courses/${course.id}`, formData);
        toast.success('Course updated successfully');
      } else {
        await axios.post('http://localhost:3001/courses', {
          ...formData,
          enrollmentCount: 0
        });
        toast.success('Course added successfully');
      }

      const response = await axios.get('http://localhost:3001/courses');
      dispatch(setCourses(response.data));
      onClose();
    } catch (error) {
      toast.error('Failed to save course');
      console.error('Error saving course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code
          </label>
          <input
            type="text"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
            placeholder="e.g., CS101"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
            placeholder="Course Title"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        {/* Credits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credits
          </label>
          <select
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          >
            {[1, 2, 3, 4].map(credit => (
              <option key={credit} value={credit}>
                {credit} {credit === 1 ? 'Credit' : 'Credits'}
              </option>
            ))}
          </select>
        </div>

        {/* Faculty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faculty
          </label>
          <select
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          >
            <option value="">Select Faculty</option>
            {faculty.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Max Enrollment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Enrollment
          </label>
          <input
            type="number"
            value={formData.maxEnrollment}
            onChange={(e) => setFormData({ ...formData, maxEnrollment: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
            min={1}
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          >
            <option value="CSE">Computer Science</option>
            <option value="EEE">Electrical Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
          </select>
        </div>

        {/* Syllabus */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Syllabus
          </label>
          <textarea
            value={formData.syllabus}
            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Enter course syllabus..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {course ? 'Update' : 'Add'} Course
        </button>
      </div>
    </form>
  );
} 