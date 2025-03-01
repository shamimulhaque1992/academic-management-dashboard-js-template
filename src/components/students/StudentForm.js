'use client';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setStudents } from '@/redux/features/studentSlice';
import toast from 'react-hot-toast';

export default function StudentForm({ student, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    batch: '',
    department: 'CSE',
    gpa: '',
    enrolledCourses: []
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses');
      }
    };

    fetchCourses();

    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (student) {
        await axios.put(`http://localhost:3001/students/${student.id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await axios.post('http://localhost:3001/students', formData);
        toast.success('Student added successfully');
      }

      const response = await axios.get('http://localhost:3001/students');
      dispatch(setStudents(response.data));
      onClose();
    } catch (error) {
      toast.error('Failed to save student');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student ID
          </label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch
          </label>
          <select
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          >
            <option value="">Select Batch</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
        </div>

        {/* GPA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            required
          />
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enrolled Courses
        </label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
          {courses.map(course => (
            <label key={course.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={formData.enrolledCourses?.includes(course.id)}
                onChange={(e) => {
                  const updatedCourses = e.target.checked
                    ? [...(formData.enrolledCourses || []), course.id]
                    : formData.enrolledCourses?.filter(id => id !== course.id);
                  setFormData({ ...formData, enrolledCourses: updatedCourses });
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {course.courseCode} - {course.title}
              </span>
            </label>
          ))}
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
          {student ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
} 