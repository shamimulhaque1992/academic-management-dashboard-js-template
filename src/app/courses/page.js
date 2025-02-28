'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Download } from 'lucide-react';
import CourseList from '@/components/courses/CourseList';
import CourseFilters from '@/components/courses/CourseFilters';
import { exportToCSV } from '@/utils/exportUtils';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    faculty: '',
    credits: '',
    enrollmentRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, facultyRes] = await Promise.all([
          axios.get('http://localhost:3001/courses'),
          axios.get('http://localhost:3001/faculty')
        ]);
        setCourses(coursesRes.data);
        setFaculty(facultyRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const data = filteredCourses.map(course => {
      const facultyMember = faculty.find(f => f.id === course.facultyId);
      return {
        'Course Code': course.courseCode,
        'Title': course.title,
        'Credits': course.credits,
        'Faculty': facultyMember?.name || 'Not Assigned',
        'Enrollment Count': course.enrollmentCount
      };
    });
    exportToCSV(data, 'courses_list');
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = !filters.faculty || course.facultyId === parseInt(filters.faculty);
    const matchesCredits = !filters.credits || course.credits === parseInt(filters.credits);
    
    let matchesEnrollment = true;
    if (filters.enrollmentRange !== 'all') {
      const [min, max] = filters.enrollmentRange.split('-').map(Number);
      matchesEnrollment = course.enrollmentCount >= min && 
        (max ? course.enrollmentCount <= max : true);
    }

    return matchesSearch && matchesFaculty && matchesCredits && matchesEnrollment;
  });

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Course Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter size={20} className="mr-2" />
            Filters
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={20} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <CourseFilters
          filters={filters}
          setFilters={setFilters}
          faculty={faculty}
        />
      )}

      {/* Courses List */}
      <CourseList 
        courses={filteredCourses}
        faculty={faculty}
        loading={loading}
      />
    </div>
  );
} 