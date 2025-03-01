'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Book, Users, BarChart, Search, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FacultyDashboard({ params }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for course assignment
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for grade management
  const [grades, setGrades] = useState({});

  // Add this to your existing state declarations
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;

      try {
        // First fetch faculty data
        const facultyRes = await axios.get(`http://localhost:3001/faculty/${params.id}`);
        setFaculty(facultyRes.data);

        // Then fetch all courses
        const coursesRes = await axios.get('http://localhost:3001/courses');
        const allCourses = coursesRes.data;
        
        // Fetch faculty-courses assignments
        const facultyCoursesRes = await axios.get(`http://localhost:3001/faculty-courses?facultyId=${params.id}`);
        const assignedCourseIds = facultyCoursesRes.data.map(fc => fc.courseId);

        // Filter courses based on assignments
        const assignedCourses = allCourses.filter(course => 
          assignedCourseIds.includes(course.id) || 
          facultyRes.data.assignedCourses?.includes(course.id.toString())
        );
        
        setCourses(assignedCourses);
        setAssignedCourses(assignedCourses);

        // Fetch students and enrollments
        const [studentsRes, enrollmentsRes] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/enrollments')
        ]);

        setStudents(studentsRes.data);
        setEnrollments(enrollmentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [params?.id, mounted]);

  const handleAssignStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      toast.error('Please select a course and at least one student');
      return;
    }

    try {
      await Promise.all(
        selectedStudents.map(studentId =>
          axios.post('http://localhost:3001/enrollments', {
            courseId: parseInt(selectedCourse),
            studentId: parseInt(studentId),
            enrollmentDate: new Date().toISOString(),
            grade: null
          })
        )
      );

      toast.success('Students assigned successfully');
      setSelectedStudents([]);
      
      // Refresh enrollments
      const response = await axios.get('http://localhost:3001/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to assign students');
    }
  };

  const handleSaveGrades = async () => {
    try {
      await Promise.all(
        Object.entries(grades).map(([enrollmentId, grade]) =>
          axios.patch(`http://localhost:3001/enrollments/${enrollmentId}`, {
            grade
          })
        )
      );
      toast.success('Grades saved successfully');
      
      // Refresh enrollments
      const response = await axios.get('http://localhost:3001/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to save grades');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!faculty) {
    return <div className="text-center py-8">Faculty member not found</div>;
  }

  const calculateStats = () => {
    const totalStudents = new Set(enrollments.map(e => e.studentId)).size;
    
    let averageGrade = 0;
    if (enrollments.length > 0) {
      const validGrades = enrollments.filter(e => e.grade);
      if (validGrades.length > 0) {
        const gradePoints = {
          'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
          'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0
        };
        
        averageGrade = validGrades.reduce((acc, curr) => {
          return acc + (gradePoints[curr.grade] || 0);
        }, 0) / validGrades.length;
      }
    }

    return {
      totalCourses: courses.length,
      totalStudents,
      averageGrade: averageGrade.toFixed(2)
    };
  };

  const stats = calculateStats();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Book className="h-10 w-10 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalCourses}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-10 w-10 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center">
                  <BarChart className="h-10 w-10 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Average Grade</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.averageGrade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map(course => {
                      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                      const avgGrade = courseEnrollments.length > 0
                        ? (courseEnrollments.reduce((acc, curr) => {
                            const gradePoints = {
                              'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0,
                              'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0
                            };
                            return acc + (gradePoints[curr.grade] || 0);
                          }, 0) / courseEnrollments.length).toFixed(2)
                        : '0.00';

                      return (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{course.courseCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{courseEnrollments.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{avgGrade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'assign':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Assign Students to Course</h2>
            
            {assignedCourses.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No courses assigned to this faculty member.
              </div>
            ) : (
              <>
                {/* Course Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Choose a course</option>
                    {assignedCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.courseCode} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Student List */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map(student => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id.toString())}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudents([...selectedStudents, student.id.toString()]);
                                } else {
                                  setSelectedStudents(selectedStudents.filter(id => id !== student.id.toString()));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Assign Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAssignStudents}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} className="mr-2" />
                    Assign Students
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'grades':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Student Grades</h2>

            {/* Course Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Choose a course</option>
                {assignedCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - {course.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <>
                {/* Search and Save Controls */}
                <div className="flex justify-between items-center mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 w-full border rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSaveGrades}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
                  >
                    <Save size={20} className="mr-2" />
                    Save Grades
                  </button>
                </div>

                {/* Grades Table */}
                <div className="border rounded-lg overflow-hidden">
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
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments
                        .filter(e => e.courseId === parseInt(selectedCourse))
                        .map(enrollment => {
                          const student = students.find(s => s.id === enrollment.studentId);
                          if (!student) return null;
                          
                          return (
                            <tr key={enrollment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.studentId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={grades[enrollment.id] || enrollment.grade || ''}
                                  onChange={(e) => setGrades({
                                    ...grades,
                                    [enrollment.id]: e.target.value
                                  })}
                                  className="border rounded px-2 py-1"
                                >
                                  <option value="">Select Grade</option>
                                  {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/faculty')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Faculty List
        </button>

        {/* Faculty Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{faculty.name}</h1>
              <p className="text-gray-600">Faculty ID: {faculty.facultyId}</p>
              <p className="text-gray-600">{faculty.designation}</p>
              <p className="text-gray-600">{faculty.email}</p>
              <p className="text-gray-600">Department: {faculty.department}</p>
              <p className="text-gray-600">Status: {faculty.status}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('assign')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assign'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Assignment
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'grades'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Grade Management
            </button>
          </nav>
        </div>

        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  );
} 