'use client';

export default function FacultyFilters({ filters, setFilters }) {
  const departments = ['CSE', 'EEE', 'ME', 'CE'];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'On Leave', value: 'on_leave' },
    { label: 'Inactive', value: 'inactive' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Designation
          </label>
          <select
            value={filters.designation}
            onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          >
            <option value="">All Designations</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 