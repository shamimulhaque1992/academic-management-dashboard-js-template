'use client';

export default function CourseFilters({ filters, setFilters, faculty }) {
  const credits = [1, 2, 3, 4];
  const enrollmentRanges = [
    { label: 'All', value: 'all' },
    { label: '0-20 students', value: '0-20' },
    { label: '21-40 students', value: '21-40' },
    { label: '41-60 students', value: '41-60' },
    { label: '60+ students', value: '60-999' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Faculty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculty
          </label>
          <select
            value={filters.faculty}
            onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
            className="w-full border rounded-md p-2"
          >
            <option value="">All Faculty</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Credits Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credits
          </label>
          <select
            value={filters.credits}
            onChange={(e) => setFilters({ ...filters, credits: e.target.value })}
            className="w-full border rounded-md p-2"
          >
            <option value="">All Credits</option>
            {credits.map((credit) => (
              <option key={credit} value={credit}>
                {credit} {credit === 1 ? 'Credit' : 'Credits'}
              </option>
            ))}
          </select>
        </div>

        {/* Enrollment Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enrollment Range
          </label>
          <select
            value={filters.enrollmentRange}
            onChange={(e) => setFilters({ ...filters, enrollmentRange: e.target.value })}
            className="w-full border rounded-md p-2"
          >
            {enrollmentRanges.map((range) => (
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