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
            Status
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border rounded-md p-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Course Assignment Section */}
      <div>
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editData ? 'Update Faculty' : 'Create Faculty'}
        </button>
      </div>
    </form>
  );
} 