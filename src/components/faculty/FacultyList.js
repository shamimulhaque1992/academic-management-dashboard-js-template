'use client';
import { useState } from 'react';
import { Edit, Trash2, Eye, Mail, Phone, Building2, GraduationCap } from 'lucide-react';
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
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  Faculty ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {f.facultyId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{f.name}</div>
                    <div className="text-xs text-gray-500">{f.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.department}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      f.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : f.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(f)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(f)}
                        className="p-1 text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {faculty.map((f) => (
          <div key={f.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{f.name}</h3>
                  <p className="text-sm text-gray-600">{f.facultyId}</p>
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  f.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : f.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {f.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{f.designation}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{f.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{f.department}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleView(f)}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEdit(f)}
                  className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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