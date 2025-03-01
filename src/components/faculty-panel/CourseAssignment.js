'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';

export default function CourseAssignment({ facultyId }) {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyId]);

  const handleAssign = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      toast.error('Please select a course and at least one student');
      return;
    }

    try {
      // Create enrollment records for selected students
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
    } catch (error) {
      toast.error('Failed to assign students');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Assign Students to Course</h2>
        
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
            onClick={handleAssign}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Assign Students
          </button>
        </div>
      </div>
    </div>
  );
} 