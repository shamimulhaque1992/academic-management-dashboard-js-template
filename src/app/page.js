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

        setStats({
          totalStudents: studentsRes.data.length,
          totalCourses: coursesRes.data.length,
          totalFaculty: facultyRes.data.length,
        });

        const sortedStudents = [...studentsRes.data].sort((a, b) => b.gpa - a.gpa);
        setTopStudents(sortedStudents.slice(0, 5));

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
    <div className="p-2 sm:p-4 max-w-[1600px] mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
          color="text-green-600"
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon={<GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />}
          color="text-purple-600"
        />
      </div>

      {/* Top Students & Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <div className="w-full overflow-hidden">
          <TopStudentsTable students={topStudents} />
        </div>
        <div className="w-full overflow-hidden">
          <PopularCoursesTable courses={popularCourses} />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full overflow-hidden">
          <EnrollmentChart courses={popularCourses} />
        </div>
        <div className="w-full overflow-hidden">
          <GradeDistribution enrollments={enrollments} />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 font-medium text-xs sm:text-sm">{title}</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 sm:mt-2 ${color}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};
