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
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    labels: data.map(d => `Grade ${d.name}`),
    colors: data.map(d => GRADE_COLORS[d.name]),
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'inherit',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
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
          height: '280px'
        },
        legend: {
          fontSize: '12px',
          position: 'bottom',
          offsetY: 0,
          markers: {
            width: 10,
            height: 10,
            radius: 5
          }
        }
      }
    }]
  };

  const series = data.map(d => d.value);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Grade Distribution</h2>
      <div className="h-[250px] sm:h-[300px] w-full">
        <Chart
          options={options}
          series={series}
          type="pie"
          height="100%"
          width="100%"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
        {data.map(({ name, value, percentage }) => (
          <div key={name} className="flex items-center justify-between p-1 sm:p-2 bg-gray-50 rounded">
            <span className="flex items-center">
              <span 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2" 
                style={{ backgroundColor: GRADE_COLORS[name] }}
              />
              Grade {name}
            </span>
            <span className="text-gray-600 ml-1">{percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
} 