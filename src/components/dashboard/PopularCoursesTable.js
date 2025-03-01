'use client';

export default function PopularCoursesTable({ courses }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Most Popular Courses</h2>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Enrollments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-800">
                        {course.title}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-600">
                        {course.courseCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                      {course.enrollmentCount} students
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 