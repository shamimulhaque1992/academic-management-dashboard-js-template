'use client';

export default function TopStudentsTable({ students }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Top Performing Students</h2>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-600">
                    #{index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-800">
                          {student.name}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-600">
                          {student.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs sm:text-sm font-medium bg-green-100 text-green-700 rounded-full">
                      {student.gpa.toFixed(2)}
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