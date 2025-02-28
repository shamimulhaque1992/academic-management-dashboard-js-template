'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, BookOpen, GraduationCap, Users, Clock } from 'lucide-react';
import axios from 'axios';

export default function FacultyDetails({ faculty }) {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (faculty) {
        try {
          const response = await axios.get(`http://localhost:3001/courses?facultyId=${faculty.id}`);
          setAssignedCourses(response.data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [faculty]);

  if (!faculty) return null;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">{faculty.name}</h3>
        <p className="text-sm text-gray-500">{faculty.facultyId}</p>
      </div>

      {/* Contact and Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-5 w-5 mr-2" />
            <span>{faculty.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-5 w-5 mr-2" />
            <span>{faculty.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Joined: {new Date(faculty.joinDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="h-5 w-5 mr-2" />
            <span>{faculty.designation}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-5 w-5 mr-2" />
            <span>{faculty.department}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-5 w-5 mr-2" />
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${faculty.status === 'active' ? 'bg-green-100 text-green-800' : 
                faculty.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {faculty.status === 'on_leave' ? 'On Leave' : 
                faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Specialization and Qualifications */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specialization</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {faculty.specialization || 'Not specified'}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Qualifications</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {faculty.qualifications || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">
            Current Courses
          </h4>
          <span className="text-sm text-gray-500">
            {assignedCourses.length} course(s)
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 p-4">Loading courses...</p>
        ) : (
          <div className="bg-white rounded-lg border divide-y">
            {assignedCourses.length > 0 ? (
              assignedCourses.map(course => (
                <div key={course.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {course.courseCode} - {course.title}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        {course.credits} Credits
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.enrollmentCount}/{course.maxEnrollment}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">
                No courses currently assigned
              </p>
            )}
          </div>
        )}
      </div>

      {/* Teaching History - This could be expanded in the future */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Teaching History
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">
            Teaching history feature coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 