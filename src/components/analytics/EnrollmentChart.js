'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function EnrollmentChart({ courses }) {
  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      foreColor: '#4B5563'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%',
      }
    },
    xaxis: {
      categories: courses.map(course => course.courseCode),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 500,
          colors: '#4B5563'
        },
        rotate: -45,
        trim: true,
        maxHeight: 120
      },
      title: {
        text: 'Course Code',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 500,
          colors: '#4B5563'
        }
      },
      title: {
        text: 'Number of Students',
        style: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151'
        }
      }
    },
    colors: ['#2563EB'],
    tooltip: {
      theme: 'light',
      y: {
        title: {
          formatter: () => 'Students'
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    responsive: [{
      breakpoint: 480,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '85%'
          }
        },
        xaxis: {
          labels: {
            rotate: -45,
            maxHeight: 60
          }
        }
      }
    }]
  };

  const series = [{
    name: 'Enrolled Students',
    data: courses.map(course => course.enrollmentCount)
  }];

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Course Enrollments</h2>
      <div className="h-[250px] sm:h-[300px] w-full">
        <Chart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
} 