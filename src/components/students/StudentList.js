'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import { setStudents } from '@/redux/features/studentSlice';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import StudentForm from './StudentForm';
import StudentProfile from './StudentProfile';

export default function StudentList({ students, loading }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}`);
        const updatedStudents = students.filter((student) => student.id !== id);
        dispatch(setStudents(updatedStudents));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Students List</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
            </select>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add Student
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${student.gpa >= 3.5 ? 'bg-green-100 text-green-800' : 
                        student.gpa >= 3.0 ? 'bg-blue-100 text-blue-800' :
                        student.gpa >= 2.0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(student)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Edit Student"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          student={selectedStudent}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Student Profile"
      >
        <StudentProfile student={selectedStudent} />
      </Modal>
    </>
  );
} 