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
    // Fetch available courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();

    // If editing, populate form with student data
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (student) {
        // Update existing student
        await axios.put(`http://localhost:3001/students/${student.id}`, formData);
        toast.success('Student updated successfully');
      } else {
        // Add new student
        await axios.post('http://localhost:3001/students', formData);
        toast.success('Student added successfully');
      }

      // Refresh students list
      const response = await axios.get('http://localhost:3001/students');
      dispatch(setStudents(response.data));
      onClose();
    } catch (error) {
      toast.error('Failed to save student');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Batch
          </label>
          <select
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
          <label className="block text-sm font-medium text-gray-700">
            GPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Enrolled Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enrolled Courses
        </label>
        <div className="max-h-48 overflow-y-auto border rounded-md p-2">
          {courses.map(course => (
            <label key={course.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.enrolledCourses?.includes(course.id)}
                onChange={(e) => {
                  const updatedCourses = e.target.checked
                    ? [...(formData.enrolledCourses || []), course.id]
                    : formData.enrolledCourses?.filter(id => id !== course.id);
                  setFormData({ ...formData, enrolledCourses: updatedCourses });
                }}
                className="rounded text-blue-600"
              />
              <span className="text-sm">
                {course.courseCode} - {course.title}
              </span>
            </label>
          ))}
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
          {student ? 'Update' : 'Add'} Student
        </button>
      </div>
    </form>
  );
} 