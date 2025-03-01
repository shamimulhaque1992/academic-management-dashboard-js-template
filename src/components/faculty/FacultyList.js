'use client';
import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import Modal from '@/components/common/Modal';
import FacultyForm from './FacultyForm';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function FacultyList({ faculty, loading, onRefresh }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleView = (member) => {
    router.push(`/faculty/${member.id}`);
  };

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await axios.delete(`http://localhost:3001/faculty/${id}`);
        toast.success('Faculty deleted successfully');
        onRefresh();
      } catch (error) {
        toast.error('Failed to delete faculty');
      }
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    
    if (status.toLowerCase() === 'on_leave') return 'On Leave';
    return status.charAt(0).toUpperCase() + status.toLowerCase().slice(1);
  };

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faculty.map((f) => (
                <tr key={f.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{f.facultyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{f.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{f.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{f.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{f.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      f.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleView(f)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(f)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFaculty(null);
        }}
        title="Edit Faculty Member"
      >
        <FacultyForm
          editData={selectedFaculty}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFaculty(null);
          }}
          onSuccess={(updatedFaculty) => {
            onRefresh();
            setShowEditModal(false);
            setSelectedFaculty(null);
          }}
        />
      </Modal>
    </>
  );
} 