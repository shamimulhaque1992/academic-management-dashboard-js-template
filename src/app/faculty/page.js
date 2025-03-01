'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';
import axios from 'axios';
import FacultyList from '@/components/faculty/FacultyList';
import FacultyFilters from '@/components/faculty/FacultyFilters';
import Modal from '@/components/common/Modal';
import FacultyForm from '@/components/faculty/FacultyForm';
import { exportToCSV } from '@/utils/exportUtils';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get('http://localhost:3001/faculty');
        setFaculty(response.data);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const handleExport = () => {
    const data = filteredFaculty.map(member => ({
      'Faculty ID': member.facultyId,
      'Name': member.name,
      'Email': member.email,
      'Department': member.department,
      'Designation': member.designation,
      'Courses': member.assignedCourses?.length || 0,
      'Status': member.status
    }));
    exportToCSV(data, 'faculty_list');
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filters.department || member.department === filters.department;
    const matchesDesignation = !filters.designation || member.designation === filters.designation;
    const matchesStatus = filters.status === 'all' || member.status === filters.status;

    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
  });

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors w-full sm:w-auto"
          >
            <Filter size={20} className="mr-2 text-gray-600" />
            Filters
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            <Download size={20} className="mr-2" />
            Export
          </button>

          {/* Add Faculty Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={20} className="mr-2" />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6">
          <FacultyFilters
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      )}

      {/* Faculty List */}
      <div className="bg-white rounded-lg shadow-md">
        <FacultyList 
          faculty={filteredFaculty}
          loading={loading}
          onRefresh={() => setFaculty([...faculty])}
        />
      </div>

      {/* Add/Edit Faculty Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Faculty Member"
      >
        <FacultyForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={(updatedFaculty) => {
            setFaculty(updatedFaculty);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
} 