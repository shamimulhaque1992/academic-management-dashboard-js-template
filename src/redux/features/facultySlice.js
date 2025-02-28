import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  faculty: [],
  loading: false,
  error: null,
  selectedFaculty: null,
};

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setFaculty: (state, action) => {
      state.faculty = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedFaculty: (state, action) => {
      state.selectedFaculty = action.payload;
    },
  },
});

export const { setFaculty, setLoading, setError, setSelectedFaculty } = facultySlice.actions;
export default facultySlice.reducer; 