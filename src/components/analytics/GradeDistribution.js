'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const GRADE_COLORS = {
  'A': '#22c55e',  // green-500
  'A-': '#4ade80', // green-400
  'B+': '#3b82f6', // blue-500
  'B': '#60a5fa',  // blue-400
  'B-': '#f59e0b', // amber-500
  'C+': '#fbbf24', // amber-400
  'C': '#ef4444',  // red-500
  'F': '#dc2626',  // red-600
};

const GRADE_ORDER = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F'];

export default function GradeDistribution({ enrollments }) {
  const gradeCount = enrollments.reduce((acc, curr) => {
    acc[curr.grade] = (acc[curr.grade] || 0) + 1;
    return acc;
  }, {});

  const data = GRADE_ORDER
    .filter(grade => gradeCount[grade])
    .map(grade => ({
      name: grade,
      value: gradeCount[grade],
      percentage: ((gradeCount[grade] / enrollments.length) * 100).toFixed(1)
    }));

  const options = {
    chart: {
      type: 'pie',
    },
    labels: data.map(d => `Grade ${d.name}`),
    colors: data.map(d => GRADE_COLORS[d.name]),
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} students (${((value / enrollments.length) * 100).toFixed(1)}%)`
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = data.map(d => d.value);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
      <div className="h-[300px]">
        <Chart
          options={options}
          series={series}
          type="pie"
          height="100%"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {data.map(({ name, value, percentage }) => (
          <div key={name} className="flex items-center justify-between">
            <span className="flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: GRADE_COLORS[name] }}
              />
              Grade {name}
            </span>
            <span className="text-gray-600">{percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
} 