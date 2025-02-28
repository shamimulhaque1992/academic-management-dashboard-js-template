'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

export default function DepartmentStats() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgGPA: 0,
    totalFaculty: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, faculty] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/faculty'),
        ]);

        const avgGPA = students.data.reduce((acc, curr) => acc + curr.gpa, 0) / students.data.length;

        setStats({
          totalStudents: students.data.length,
          avgGPA: avgGPA.toFixed(2),
          totalFaculty: faculty.data.length,
        });
      } catch (error) {
        console.error('Error fetching department stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
          <BookOpen className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Average GPA</p>
            <p className="text-2xl font-bold">{stats.avgGPA}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
          <GraduationCap className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Faculty Members</p>
            <p className="text-2xl font-bold">{stats.totalFaculty}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 