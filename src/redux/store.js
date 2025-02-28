import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './features/studentSlice';
import coursesReducer from './features/courseSlice';
import facultyReducer from './features/facultySlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    courses: coursesReducer,
    faculty: facultyReducer,
  },
}); 