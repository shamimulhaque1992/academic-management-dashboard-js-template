'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, BookOpen, Users, Award, GraduationCap } from 'lucide-react';
import axios from 'axios';

export default function FacultyDetails({ faculty }) {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    courseCount: 0
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (faculty) {
        try {
          // Fetch courses assigned to faculty
          const coursesResponse = await axios.get(`http://localhost:3001/courses?facultyId=${faculty.id}`);
          const courses = coursesResponse.data;
          setAssignedCourses(courses);

          // Calculate statistics
          let totalStudents = 0;
          let totalGrades = 0;
          let gradeCount = 0;

          for (const course of courses) {
            totalStudents += course.enrollmentCount || 0;
            if (course.averageGrade) {
              totalGrades += course.averageGrade;
              gradeCount++;
            }
          }

          setStats({
            totalStudents,
            averageGrade: gradeCount > 0 ? (totalGrades / gradeCount).toFixed(2) : 'N/A',
            courseCount: courses.length
          });
        } catch (error) {
          console.error('Error fetching faculty data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFacultyData();
  }, [faculty]);

  if (!faculty) return null;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto px-4">
      {/* Faculty Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-bold text-gray-800">{faculty.name}</h3>
        <p className="text-sm font-medium text-gray-600">{faculty.facultyId}</p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-gray-700 font-medium">{faculty.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-gray-700 font-medium">{faculty.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-gray-700 font-medium">
              Joined: {new Date(faculty.joinDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Status and Department */}
        <div className="space-y-3">
          <div className="flex items-center">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full 
              ${faculty.status === 'active' ? 'bg-green-100 text-green-800' : 
                faculty.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {faculty.status === 'on_leave' ? 'On Leave' : 
                faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Department:</span>
            <span className="ml-2 text-gray-700">{faculty.department}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Designation:</span>
            <span className="ml-2 text-gray-700">{faculty.designation}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-700">Courses</p>
              <p className="text-xl font-bold text-blue-900">{stats.courseCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-700">Students</p>
              <p className="text-xl font-bold text-green-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-700">Avg. Grade</p>
              <p className="text-xl font-bold text-purple-900">{stats.averageGrade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialization and Qualifications */}
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Specialization</h4>
          <p className="text-sm text-gray-700">{faculty.specialization || 'Not specified'}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Qualifications</h4>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {faculty.qualifications || 'Not specified'}
          </p>
        </div>
      </div>

      {/* Assigned Courses */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">
          Assigned Courses ({assignedCourses.length})
        </h4>
        {loading ? (
          <p className="text-sm text-gray-600">Loading courses...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            {assignedCourses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {assignedCourses.map(course => (
                  <li key={course.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {course.courseCode} - {course.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course.credits} Credits • {course.enrollmentCount || 0} Students
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {course.department}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-gray-600 text-center">No courses assigned</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 