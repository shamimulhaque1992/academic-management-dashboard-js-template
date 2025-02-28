'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Book, GraduationCap, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentProfile({ params }) {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentRes, enrollmentsRes, coursesRes] = await Promise.all([
          axios.get(`http://localhost:3001/students/${params.id}`),
          axios.get(`http://localhost:3001/enrollments?studentId=${params.id}`),
          axios.get('http://localhost:3001/courses'),
        ]);

        setStudent(studentRes.data);
        setEnrollments(enrollmentsRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!student) {
    return <div className="text-center py-8">Student not found</div>;
  }

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const calculateGPA = () => {
    const gradePoints = {
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'F': 0.0,
    };

    const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
    if (studentEnrollments.length === 0) return 0;

    const totalPoints = studentEnrollments.reduce((acc, curr) => {
      return acc + (gradePoints[curr.grade] || 0);
    }, 0);

    return (totalPoints / studentEnrollments.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
              <p className="text-gray-600">Student ID: {student.studentId}</p>
              <p className="text-gray-600">Email: {student.email}</p>
              <p className="text-gray-600">Phone: {student.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">Batch {student.batch}</p>
              <p className="text-gray-600">{student.department}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                GPA: {calculateGPA()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Book className="mr-2" size={20} />
              Enrolled Courses
            </h2>
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.courseCode}</p>
                  <p className="text-sm text-gray-600">Credits: {course.credits}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Grades
            </h2>
            <div className="space-y-4">
              {enrollments.map(enrollment => {
                const course = courses.find(c => c.id === enrollment.courseId);
                return (
                  <div key={enrollment.id} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium">{course?.title}</h3>
                    <p className="text-sm text-gray-600">{course?.courseCode}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      Grade: {enrollment.grade}
                    </p>
                    <p className="text-sm text-gray-600">{enrollment.semester}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 