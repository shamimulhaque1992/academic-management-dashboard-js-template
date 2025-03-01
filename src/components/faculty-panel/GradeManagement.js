'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Search } from 'lucide-react';

export default function GradeManagement({ facultyId }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          axios.get(`http://localhost:3001/courses?facultyId=${facultyId}`),
          axios.get('http://localhost:3001/students')
        ]);
        setCourses(coursesRes.data);
        setStudents(studentsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyId]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!selectedCourse) return;
      
      try {
        const response = await axios.get(`http://localhost:3001/enrollments?courseId=${selectedCourse}`);
        setEnrollments(response.data);
        
        // Initialize grades state
        const initialGrades = {};
        response.data.forEach(enrollment => {
          initialGrades[enrollment.id] = enrollment.grade || '';
        });
        setGrades(initialGrades);
      } catch (error) {
        toast.error('Failed to fetch enrollments');
      }
    };

    fetchEnrollments();
  }, [selectedCourse]);

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
    } catch (error) {
      toast.error('Failed to save grades');
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const student = students.find(s => s.id === enrollment.studentId);
    return student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
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
            {courses.map(course => (
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
                  {filteredEnrollments.map(enrollment => {
                    const student = students.find(s => s.id === enrollment.studentId);
                    return (
                      <tr key={enrollment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student?.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={grades[enrollment.id] || ''}
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
    </div>
  );
} 