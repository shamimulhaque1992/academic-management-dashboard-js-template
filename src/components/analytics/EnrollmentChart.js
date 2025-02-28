'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function EnrollmentChart({ courses }) {
  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    xaxis: {
      categories: courses.map(course => course.courseCode),
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        title: {
          formatter: () => 'Students'
        }
      }
    }
  };

  const series = [{
    name: 'Enrolled Students',
    data: courses.map(course => course.enrollmentCount)
  }];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Course Enrollments</h2>
      <div className="h-[300px]">
        <Chart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
} 