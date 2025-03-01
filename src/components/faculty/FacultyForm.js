'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FacultyForm({ onClose, onSuccess, editData }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    status: 'Active',
    assignedCourses: []
  });

  // Reset form when editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        facultyId: editData.facultyId || '',
        name: editData.name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        designation: editData.designation || '',
        department: editData.department || '',
        status: editData.status || 'Active',
        assignedCourses: []
      });
    }
  }, [editData]);

  // Fetch courses and faculty-courses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get('http://localhost:3001/courses');
        setCourses(coursesRes.data);

        if (editData?.id) {
          const facultyCoursesRes = await axios.get(`http://localhost:3001/faculty-courses?facultyId=${editData.id}`);
          const assignedCourseIds = facultyCoursesRes.data.map(fc => fc.courseId.toString());
          setFormData(prev => ({
            ...prev,
            assignedCourses: assignedCourseIds
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editData?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let facultyId;
      
      if (editData) {
        // Update existing faculty with assignedCourses included
        await axios.put(`http://localhost:3001/faculty/${editData.id}`, {
          ...formData,
          id: editData.id,
          assignedCourses: formData.assignedCourses // Include assignedCourses in faculty data
        });
        facultyId = editData.id;
        
        // Delete existing course assignments
        const existingAssignments = await axios.get(`http://localhost:3001/faculty-courses?facultyId=${editData.id}`);
        await Promise.all(
          existingAssignments.data.map(assignment =>
            axios.delete(`http://localhost:3001/faculty-courses/${assignment.id}`)
          )
        );
      } else {
        // Create new faculty with assignedCourses included
        const facultyRes = await axios.post('http://localhost:3001/faculty', {
          ...formData,
          assignedCourses: formData.assignedCourses // Include assignedCourses in faculty data
        });
        facultyId = facultyRes.data.id;
      }

      // Create faculty-course assignments
      await Promise.all(
        formData.assignedCourses.map(courseId =>
          axios.post('http://localhost:3001/faculty-courses', {
            facultyId: facultyId,
            courseId: parseInt(courseId)
          })
        )
      );

      // Refresh faculty list
      const updatedFacultyRes = await axios.get('http://localhost:3001/faculty');
      onSuccess(updatedFacultyRes.data);
      toast.success(`Faculty ${editData ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${editData ? 'update' : 'create'} faculty`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Faculty ID
          </label>
          <input
            type="text"
            required
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
            placeholder="Enter faculty ID"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Designation
          </label>
          <select
            required
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
          >
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <select
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science</option>
            <option value="EEE">Electrical Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-sm"
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Course Assignment Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Assign Courses
        </label>
        <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div key={course.id} className="flex items-center space-x-3">
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`course-${course.id}`} className="text-sm font-medium text-gray-700">
                  {course.courseCode} - {course.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editData ? 'Update Faculty' : 'Create Faculty'}
        </button>
      </div>
    </form>
  );
} 