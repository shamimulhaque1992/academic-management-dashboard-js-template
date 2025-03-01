'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Book, Users, BarChart, Search, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CourseGradeManagement from '@/components/faculty/CourseGradeManagement';
import FacultyDetails from '@/components/faculty/FacultyDetails';

export default function FacultyDashboard({ params }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // States for course assignment
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for grade management
  const [grades, setGrades] = useState({});

  // Add this to your existing state declarations
  const [assignedCourses, setAssignedCourses] = useState([]);

  // Add the missing refreshEnrollmentsData function
  const refreshEnrollmentsData = async () => {
    try {
      setLoading(true);
      console.log('Refreshing enrollments data...');
      const response = await axios.get('http://localhost:3001/enrollments');
      console.log('New enrollments data:', response.data);
      setEnrollments(response.data);
      
      // Also refresh students data to ensure we have the latest
      const studentsRes = await axios.get('http://localhost:3001/students');
      setStudents(studentsRes.data);
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing enrollments data:', error);
      toast.error('Failed to refresh enrollments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
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

  // Add this effect to refresh enrollments when switching tabs or selecting a course
  useEffect(() => {
    const refreshEnrollments = async () => {
      try {
        console.log('Refreshing enrollments for tab:', activeTab);
        const response = await axios.get('http://localhost:3001/enrollments');
        console.log('Fetched enrollments:', response.data);
        setEnrollments(response.data);
      } catch (error) {
        console.error('Error refreshing enrollments:', error);
      }
    };

    if (mounted && (activeTab === 'grades' || activeTab === 'details')) {
      refreshEnrollments();
    }
  }, [activeTab, mounted]);

  // Add this function to log the current state
  const logCurrentState = () => {
    console.log('Current State:', {
      selectedCourse,
      enrollments,
      students,
      filteredEnrollments: enrollments.filter(e => e.courseId === parseInt(selectedCourse))
    });
  };

  // Update the handleAssignStudents function
  const handleAssignStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      toast.error('Please select a course and at least one student');
      return;
    }

    try {
      console.log('Starting student assignment process...');
      console.log('Selected course:', selectedCourse);
      console.log('Selected students:', selectedStudents);

      // Check for existing enrollments
      const existingEnrollments = enrollments.filter(
        e => e.courseId === parseInt(selectedCourse) && selectedStudents.includes(e.studentId)
      );

      if (existingEnrollments.length > 0) {
        console.log('Found existing enrollments:', existingEnrollments);
        const existingStudentIds = existingEnrollments.map(e => e.studentId);
        const newStudents = selectedStudents.filter(id => !existingStudentIds.includes(id));

        if (newStudents.length === 0) {
          toast.error('All selected students are already enrolled in this course');
          return;
        }

        // Update selected students to only include new ones
        console.log('Proceeding with new students only:', newStudents);
        setSelectedStudents(newStudents);
      }

      // Create enrollments for each student
      const enrollmentPromises = selectedStudents.map(studentId =>
        axios.post('http://localhost:3001/enrollments', {
          courseId: parseInt(selectedCourse),
          studentId: parseInt(studentId),
          enrollmentDate: new Date().toISOString(),
          grade: null
        })
      );

      await Promise.all(enrollmentPromises);
      console.log('All enrollments created successfully');

      // Refresh enrollments data
      await refreshEnrollmentsData();

      toast.success('Students assigned successfully');
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error('Failed to assign students');
    }
  };

  // Add this function to filter out already enrolled students
  const getAvailableStudents = () => {
    if (!selectedCourse) return students;
    
    const enrolledStudentIds = enrollments
      .filter(e => e.courseId === parseInt(selectedCourse))
      .map(e => e.studentId);

    return students.filter(student => !enrolledStudentIds.includes(student.id));
  };

  // Update the filteredStudents definition
  const filteredStudents = getAvailableStudents().filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveGrades = async () => {
    try {
      // Update each grade individually
      for (const [enrollmentId, grade] of Object.entries(grades)) {
        await axios.patch(`http://localhost:3001/enrollments/${enrollmentId}`, {
          grade
        });
      }
      
      toast.success('Grades saved successfully');
      
      // Clear the grades state after saving
      setGrades({});
      
      // Refresh enrollments
      const response = await axios.get('http://localhost:3001/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error saving grades:', error);
      toast.error('Failed to save grades');
    }
  };

  // Update the useEffect for tab changes
  useEffect(() => {
    const refreshData = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        console.log('Refreshing data for tab:', activeTab);
        const [enrollmentsRes, studentsRes] = await Promise.all([
          axios.get('http://localhost:3001/enrollments'),
          axios.get('http://localhost:3001/students')
        ]);

        console.log('Fetched enrollments:', enrollmentsRes.data);
        setEnrollments(enrollmentsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    refreshData();
  }, [activeTab, mounted]);

  // Update the filteredEnrollments definition to properly handle course IDs
  const filteredEnrollments = useMemo(() => {
    if (!selectedCourse) return [];
    
    console.log('Filtering enrollments for course:', selectedCourse);
    console.log('All enrollments:', enrollments);
    console.log('All students:', students);
    
    const filtered = enrollments.filter(enrollment => {
      // Convert both IDs to numbers for comparison
      const courseMatch = enrollment.courseId === Number(selectedCourse);
      if (!courseMatch) {
        console.log(`Course mismatch for enrollment ${enrollment.id}: ${enrollment.courseId} !== ${selectedCourse}`);
        return false;
      }

      const student = students.find(s => s.id === enrollment.studentId);
      if (!student) {
        console.log(`No student found for enrollment ${enrollment.id} with studentId ${enrollment.studentId}`);
        return false;
      }

      return true;
    });

    console.log('Filtered enrollments result:', filtered);
    return filtered;
  }, [selectedCourse, enrollments, students]);

  // Add this effect to refresh data when switching to grades tab
  useEffect(() => {
    const refreshEnrollmentsData = async () => {
      if (activeTab === 'grades' && selectedCourse) {
        try {
          const response = await axios.get('http://localhost:3001/enrollments');
          console.log('Refreshed enrollments for grades tab:', response.data);
          setEnrollments(response.data);
        } catch (error) {
          console.error('Error refreshing enrollments:', error);
        }
      }
    };

    refreshEnrollmentsData();
  }, [activeTab, selectedCourse]);

  // Update the handleGradeChange function
  const handleGradeChange = async (enrollmentId, grade) => {
    try {
      const response = await axios.patch(`http://localhost:3001/enrollments/${enrollmentId}`, {
        grade
      });
      
      setEnrollments(prev => 
        prev.map(e => e.id === enrollmentId ? { ...e, grade } : e)
      );
      
      toast.success('Grade updated successfully');
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error('Failed to update grade');
    }
  };

  // Add effect to monitor state changes
  useEffect(() => {
    if (selectedCourse) {
      logCurrentState();
    }
  }, [selectedCourse, enrollments]);

  // Update handleCourseChange to ensure proper data loading
  const handleCourseChange = async (courseId) => {
    console.log('Course changed to:', courseId);
    setSelectedCourse(courseId);
    setSelectedStudents([]);
    
    if (courseId) {
      setLoading(true);
      try {
        // Fetch fresh data when course changes
        const [enrollmentsRes, studentsRes] = await Promise.all([
          axios.get('http://localhost:3001/enrollments'),
          axios.get('http://localhost:3001/students')
        ]);
        
        console.log('Fetched new enrollments:', enrollmentsRes.data);
        console.log('Fetched students:', studentsRes.data);
        
        setEnrollments(enrollmentsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Add a new effect to handle tab changes and course selection
  useEffect(() => {
    const loadGradeManagementData = async () => {
      if (activeTab === 'grades' && selectedCourse) {
        setLoading(true);
        try {
          const [enrollmentsRes, studentsRes] = await Promise.all([
            axios.get('http://localhost:3001/enrollments'),
            axios.get('http://localhost:3001/students')
          ]);

          console.log('Loading grade management data for course:', selectedCourse);
          console.log('Fetched enrollments:', enrollmentsRes.data);
          console.log('Fetched students:', studentsRes.data);

          setEnrollments(enrollmentsRes.data);
          setStudents(studentsRes.data);
        } catch (error) {
          console.error('Error loading grade management data:', error);
          toast.error('Failed to load grade management data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadGradeManagementData();
  }, [activeTab, selectedCourse]);

  if (!mounted) {
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
    if (!mounted) {
      return <div className="flex justify-center items-center py-8">Initializing...</div>;
    }

    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Course Selection */}
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseCode} - {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Selection */}
            {selectedCourse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Students
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                  {getAvailableStudents().map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter((id) => id !== student.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {student.name} ({student.studentId})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Button */}
            {selectedCourse && (
              <div>
                <button
                  onClick={handleAssignStudents}
                  disabled={!selectedCourse || selectedStudents.length === 0}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Students
                </button>
              </div>
            )}
          </div>
        );

      case 'grades':
        if (loading) {
          return <div className="flex justify-center items-center py-8">Loading grade management...</div>;
        }
        
        console.log('Rendering grade management with:', {
          courses,
          selectedCourse,
          filteredEnrollments,
          students
        });
        
        return (
          <CourseGradeManagement
            courses={courses}
            selectedCourse={selectedCourse}
            onCourseChange={handleCourseChange}
            enrollments={filteredEnrollments}
            students={students}
            onEnrollmentsChange={refreshEnrollmentsData}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Faculty List</span>
        </button>
      </div>

      {/* Faculty Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <FacultyDetails faculty={faculty} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 p-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'details'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Course Assignment
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'grades'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grade Management
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Book className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Courses</p>
                    <p className="text-xl font-bold text-blue-900">{stats.totalCourses}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total Students</p>
                    <p className="text-xl font-bold text-green-900">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <BarChart className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Average Grade</p>
                    <p className="text-xl font-bold text-purple-900">{stats.averageGrade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Email:</span> {faculty?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Phone:</span> {faculty?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Department:</span> {faculty?.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Designation:</span> {faculty?.designation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
} 