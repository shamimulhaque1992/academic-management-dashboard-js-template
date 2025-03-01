'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Download } from 'lucide-react';
import StudentList from '@/components/students/StudentList';
import StudentFilters from '@/components/students/StudentFilters';
import { exportToCSV } from '@/utils/exportUtils';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    course: '',
    gpaRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/courses')
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const data = filteredStudents.map(student => ({
      'Student ID': student.studentId,
      'Name': student.name,
      'Year': student.year,
      'GPA': student.gpa,
      'Email': student.email
    }));
    exportToCSV(data, 'students_list');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = !filters.year || student.year === parseInt(filters.year);
    const matchesCourse = !filters.course || student.courses?.includes(parseInt(filters.course));
    
    let matchesGPA = true;
    if (filters.gpaRange !== 'all') {
      const [min, max] = filters.gpaRange.split('-').map(Number);
      matchesGPA = student.gpa >= min && student.gpa <= max;
    }

    return matchesSearch && matchesYear && matchesCourse && matchesGPA;
  });

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Download size={20} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6">
          <StudentFilters
            filters={filters}
            setFilters={setFilters}
            courses={courses}
          />
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-md">
        <StudentList 
          students={filteredStudents}
          loading={loading}
        />
      </div>
    </div>
  );
} 