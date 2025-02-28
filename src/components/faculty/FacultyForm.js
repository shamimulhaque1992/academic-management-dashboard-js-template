'use client';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setFaculty } from '@/redux/features/facultySlice';
import toast from 'react-hot-toast';

export default function FacultyForm({ faculty, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CSE',
    designation: '',
    specialization: '',
    courses: [],
  });

  useEffect(() => {
    if (faculty) {
      setFormData(faculty);
    }
  }, [faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (faculty) {
        await axios.put(`http://localhost:3001/faculty/${faculty.id}`, formData);
        toast.success('Faculty member updated successfully');
      } else {
        await axios.post('http://localhost:3001/faculty', formData);
        toast.success('Faculty member added successfully');
      }

      const response = await axios.get('http://localhost:3001/faculty');
      dispatch(setFaculty(response.data));
      onClose();
    } catch (error) {
      toast.error('Failed to save faculty member');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Designation</label>
        <select
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Designation</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Lecturer">Lecturer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          type="text"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
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
          {faculty ? 'Update' : 'Add'} Faculty Member
        </button>
      </div>
    </form>
  );
} 