'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateFaculty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    specialization: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    assignedCourses: []
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/courses');
        setCourses(response.data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create faculty record
      const facultyResponse = await axios.post('http://localhost:3001/faculty', {
        ...formData,
        courses: formData.assignedCourses.map(id => parseInt(id))
      });
      
      // Create faculty-course assignments
      await Promise.all(
        formData.assignedCourses.map(courseId =>
          axios.post('http://localhost:3001/faculty-courses', {
            facultyId: facultyResponse.data.id,
            courseId: parseInt(courseId)
          })
        )
      );

      toast.success('Faculty created successfully');
      router.push('/faculty');
    } catch (error) {
      toast.error('Failed to create faculty');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/faculty')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Faculty List
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Faculty</h1>
          
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
                  placeholder="e.g., FAC001"
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
                  placeholder="Full Name"
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
                  placeholder="email@example.com"
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
                  placeholder="Phone number"
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
                  placeholder="e.g., CSE"
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
                  placeholder="Area of specialization"
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
            </div>

            {/* Course Assignment Section */}
            <div className="mt-6">
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Faculty
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 