'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditFacultyModal({ faculty, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    specialization: '',
    status: 'Active',
    joinDate: '',
    assignedCourses: []
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await axios.get('http://localhost:3001/courses');
        setCourses(coursesRes.data);

        // Fetch faculty-courses
        const facultyCoursesRes = await axios.get(`http://localhost:3001/faculty-courses?facultyId=${faculty.id}`);
        const assignedCourseIds = facultyCoursesRes.data.map(fc => fc.courseId.toString());

        // Set form data
        setFormData({
          ...faculty,
          assignedCourses: assignedCourseIds
        });
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update faculty record
      await axios.put(`http://localhost:3001/faculty/${faculty.id}`, {
        ...formData,
        courses: formData.assignedCourses.map(id => parseInt(id))
      });

      // Delete existing faculty-course assignments
      const existingAssignments = await axios.get(`http://localhost:3001/faculty-courses?facultyId=${faculty.id}`);
      await Promise.all(
        existingAssignments.data.map(assignment =>
          axios.delete(`http://localhost:3001/faculty-courses/${assignment.id}`)
        )
      );

      // Create new faculty-course assignments
      await Promise.all(
        formData.assignedCourses.map(courseId =>
          axios.post('http://localhost:3001/faculty-courses', {
            facultyId: faculty.id,
            courseId: parseInt(courseId)
          })
        )
      );

      toast.success('Faculty updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update faculty');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Faculty</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <select
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Courses
                </label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map(course => (
                      <div key={course.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`course-${course.id}`}
                          checked={formData.assignedCourses.includes(course.id.toString())}
                          onChange={(e) => {
                            const courseId = course.id.toString();
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assignedCourses: [...formData.assignedCourses, courseId]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedCourses: formData.assignedCourses.filter(id => id !== courseId)
                              });
                            }
                          }}
                          className="rounded border-gray-300 mr-2"
                        />
                        <label htmlFor={`course-${course.id}`} className="text-sm">
                          {course.courseCode} - {course.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Faculty
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 