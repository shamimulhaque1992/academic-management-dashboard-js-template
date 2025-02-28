'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F'];

export default function GradeForm({ enrollment, onClose, onSuccess }) {
  const [grade, setGrade] = useState(enrollment?.grade || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3001/enrollments/${enrollment.id}`,
        { grade }
      );
      toast.success('Grade updated successfully');
      onSuccess(response.data);
    } catch (error) {
      toast.error('Failed to update grade');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Grade</label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Grade</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
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
          Update Grade
        </button>
      </div>
    </form>
  );
} 