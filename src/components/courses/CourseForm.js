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
        // Update existing course
        await axios.put(`http://localhost:3001/courses/${course.id}`, formData);
        toast.success('Course updated successfully');
      } else {
        // Add new course
        await axios.post('http://localhost:3001/courses', {
          ...formData,
          enrollmentCount: 0
        });
        toast.success('Course added successfully');
      }

      // Refresh courses list
      const response = await axios.get('http://localhost:3001/courses');
      dispatch(setCourses(response.data));
      onClose();
    } catch (error) {
      toast.error('Failed to save course');
      console.error('Error saving course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <input
            type="text"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            placeholder="e.g., CS101"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            placeholder="Course Title"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Credits */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credits
          </label>
          <select
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            {[1, 2, 3, 4].map(credit => (
              <option key={credit} value={credit}>
                {credit}
              </option>
            ))}
          </select>
        </div>

        {/* Faculty */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Faculty
          </label>
          <select
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
          <label className="block text-sm font-medium text-gray-700">
            Maximum Enrollment
          </label>
          <input
            type="number"
            value={formData.maxEnrollment}
            onChange={(e) => setFormData({ ...formData, maxEnrollment: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            min={1}
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
          <label className="block text-sm font-medium text-gray-700">
            Syllabus
          </label>
          <textarea
            value={formData.syllabus}
            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter course syllabus..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {course ? 'Update' : 'Add'} Course
        </button>
      </div>
    </form>
  );
} 