'use client';

export default function StudentFilters({ filters, setFilters, courses }) {
  const years = [1, 2, 3, 4];
  const gpaRanges = [
    { label: 'All', value: 'all' },
    { label: '3.5 - 4.0', value: '3.5-4.0' },
    { label: '3.0 - 3.49', value: '3.0-3.49' },
    { label: '2.5 - 2.99', value: '2.5-2.99' },
    { label: '2.0 - 2.49', value: '2.0-2.49' },
    { label: 'Below 2.0', value: '0-1.99' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        </div>

        {/* Course Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseCode} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* GPA Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPA Range
          </label>
          <select
            value={filters.gpaRange}
            onChange={(e) => setFilters({ ...filters, gpaRange: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            {gpaRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 