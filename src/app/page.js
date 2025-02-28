"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Users, BookOpen, GraduationCap } from "lucide-react";
import TopStudentsTable from '@/components/dashboard/TopStudentsTable';
import PopularCoursesTable from '@/components/dashboard/PopularCoursesTable';
import EnrollmentChart from '@/components/analytics/EnrollmentChart';
import GradeDistribution from '@/components/analytics/GradeDistribution';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
  });
  const [topStudents, setTopStudents] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, coursesRes, facultyRes, enrollmentsRes] = await Promise.all([
          axios.get("http://localhost:3001/students"),
          axios.get("http://localhost:3001/courses"),
          axios.get("http://localhost:3001/faculty"),
          axios.get("http://localhost:3001/enrollments"),
        ]);

        // Set basic stats
        setStats({
          totalStudents: studentsRes.data.length,
          totalCourses: coursesRes.data.length,
          totalFaculty: facultyRes.data.length,
        });

        // Process top students (sort by GPA)
        const sortedStudents = [...studentsRes.data].sort((a, b) => b.gpa - a.gpa);
        setTopStudents(sortedStudents.slice(0, 5));

        // Process popular courses
        const courseEnrollments = coursesRes.data.map(course => ({
          ...course,
          enrollmentCount: enrollmentsRes.data.filter(e => e.courseId === course.id).length
        }));
        const sortedCourses = courseEnrollments.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        setPopularCourses(sortedCourses.slice(0, 5));

        setEnrollments(enrollmentsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-8 w-8 text-blue-500" />}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon={<GraduationCap className="h-8 w-8 text-purple-500" />}
        />
      </div>

      {/* Top Students & Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopStudentsTable students={topStudents} />
        <PopularCoursesTable courses={popularCourses} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentChart courses={popularCourses} />
        <GradeDistribution enrollments={enrollments} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};
