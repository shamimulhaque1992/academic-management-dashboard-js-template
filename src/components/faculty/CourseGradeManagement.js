'use client';
import { useState, useEffect } from 'react';
import { Save, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CourseGradeManagement({ course }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      if (!course || !course.id) return;
      
      try {
        const response = await axios.get(`http://localhost:3001/students?enrolledCourses=${course.id}`);
        const studentsData = response.data;
        
        // Initialize grades from existing data
        const initialGrades = {};
        studentsData.forEach(student => {
          if (student && student.id) {
            initialGrades[student.id] = student.grades?.[course.id] || '';
          }
        });
        
        setStudents(studentsData);
        setGrades(initialGrades);
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
        toast.error('Failed to fetch enrolled students');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [course?.id]);

  const handleGradeChange = (studentId, grade) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: grade
    }));
  };

  const handleSaveGrades = async () => {
    try {
      // Update grades for each student
      await Promise.all(
        Object.entries(grades).map(([studentId, grade]) => {
          const student = students.find(s => s.id === parseInt(studentId));
          if (!student) return null;

          const updatedGrades = {
            ...student.grades,
            [course.id]: grade
          };

          return axios.patch(`http://localhost:3001/students/${studentId}`, {
            grades: updatedGrades
          });
        })
      );

      toast.success('Grades saved successfully');
    } catch (error) {
      console.error('Error saving grades:', error);
      toast.error('Failed to save grades');
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleSaveGrades}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save size={20} className="mr-2" />
          Save Grades
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                Current Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Grade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.studentId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {student.grades?.[course.id] || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={grades[student.id] || ''}
                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select Grade</option>
                    {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 