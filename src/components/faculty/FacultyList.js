'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Search, Edit, Trash2, GraduationCap } from 'lucide-react';
import { setFaculty, setLoading, setError } from '@/redux/features/facultySlice';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import FacultyForm from './FacultyForm';
import { useRouter } from 'next/navigation';

export default function FacultyList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { faculty, loading } = useSelector((state) => state.faculty);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get('http://localhost:3001/faculty');
        dispatch(setFaculty(response.data));
      } catch (error) {
        dispatch(setError(error.message));
        toast.error('Failed to fetch faculty data');
      }
    };

    fetchFaculty();
  }, [dispatch]);

  const filteredFaculty = faculty.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/faculty/${id}`);
      const updatedFaculty = faculty.filter((member) => member.id !== id);
      dispatch(setFaculty(updatedFaculty));
      toast.success('Faculty member removed successfully');
    } catch (error) {
      toast.error('Failed to remove faculty member');
    }
  };

  const handleEdit = (id) => {
    const member = faculty.find((f) => f.id === id);
    setSelectedFaculty(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedFaculty(null);
    setIsModalOpen(true);
  };

  const handleViewDashboard = (id) => {
    router.push(`/faculty/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Faculty Members</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Faculty
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center cursor-pointer hover:text-blue-600"
                         onClick={() => handleViewDashboard(member.id)}>
                      <GraduationCap className="h-5 w-5 text-gray-500 mr-2" />
                      {member.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(member.id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(member.id)}
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
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
      >
        <FacultyForm
          faculty={selectedFaculty}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
} 