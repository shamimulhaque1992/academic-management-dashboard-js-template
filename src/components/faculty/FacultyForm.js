'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FacultyForm({ faculty, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    department: 'CSE',
    designation: 'Lecturer',
    specialization: '',
    qualifications: '',
    joinDate: '',
    status: 'active',
    assignedCourses: []
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        ...faculty,
        joinDate: faculty.joinDate?.split('T')[0] || ''
      });
    }
  }, [faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (faculty) {
        // Update existing faculty
        await axios.put(`http://localhost:3001/faculty/${faculty.id}`, formData);
        toast.success('Faculty member updated successfully');
      } else {
        // Add new faculty
        await axios.post('http://localhost:3001/faculty', {
          ...formData,
          assignedCourses: []
        });
        toast.success('Faculty member added successfully');
      }

      // Refresh faculty list
      const response = await axios.get('http://localhost:3001/faculty');
      onSuccess(response.data);
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error('Failed to save faculty member');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Faculty ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Faculty ID
          </label>
          <input
            type="text"
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
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

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        {/* Join Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Join Date
          </label>
          <input
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Specialization */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Specialization
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g., Machine Learning, Database Systems"
          />
        </div>

        {/* Qualifications */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Qualifications
          </label>
          <textarea
            value={formData.qualifications}
            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter academic qualifications..."
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
          {faculty ? 'Update' : 'Add'} Faculty
        </button>
      </div>
    </form>
  );
} 