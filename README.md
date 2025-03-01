# Academic Management Dashboard

## Author
**Khandoker Shamimul Haque**

## Overview
A comprehensive academic management system built with Next.js and modern web technologies. This dashboard provides faculty members and administrators with tools to manage courses, students, enrollments, and academic performance.

## Features

### Faculty Management
- Add, edit, and view faculty members
- Track faculty details including name, ID, department, and status
- Assign courses to faculty members
- View faculty-specific dashboards

### Course Management
- Manage course assignments for faculty members
- Track course enrollments and performance
- View course statistics and student distribution

### Student Management
- Assign students to courses
- Track student enrollments across different courses
- Monitor student performance and grades

### Grade Management
- Input and update student grades
- View grade distribution per course
- Track student academic progress
- Individual grade updates with immediate feedback

### Reporting & Analytics
- View comprehensive enrollment trends
- Track course performance metrics
- Analyze top-performing students
- Export reports in CSV format
- Visual data representation through charts and graphs

### Data Visualization
- Interactive charts for enrollment trends
- Performance analytics visualization
- Course-wise student distribution
- Grade distribution analysis

### Export Functionality
- Export faculty data
- Download course enrollment reports
- Generate performance reports
- CSV format support for all exports

## Technology Stack
- Next.js 15
- React 18+
- Tailwind CSS
- ApexCharts for data visualization
- Axios for API calls
- JSON Server for backend mock API

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/shamimulhaque1992/academic-management-dashboard-js-template.git
cd academic-management-dashboard-js-template
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up the mock API server
```bash
# Install JSON Server globally
npm install -g json-server

# Start the JSON Server (in a separate terminal)
npm run json-server
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to
```
http://localhost:3000
```

### Database Structure
The project uses a JSON Server with the following structure:

```json
{
  "faculty": [
    {
      "id": 1,
      "name": "Faculty Name",
      "facultyId": "FAC001",
      "email": "faculty@example.com",
      "department": "Computer Science",
      "designation": "Professor",
      "status": "active"
    }
  ],
  "courses": [
    {
      "id": 1,
      "courseCode": "CS101",
      "title": "Introduction to Programming"
    }
  ],
  "students": [
    {
      "id": 1,
      "name": "Student Name",
      "studentId": "STU001"
    }
  ],
  "enrollments": [
    {
      "id": 1,
      "courseId": 1,
      "studentId": 1,
      "grade": "A",
      "enrollmentDate": "2024-03-21T00:00:00.000Z"
    }
  ],
  "faculty-courses": [
    {
      "id": 1,
      "facultyId": 1,
      "courseId": 1
    }
  ]
}
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- ApexCharts for beautiful charts
