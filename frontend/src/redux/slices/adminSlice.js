import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  usersList: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchUsersSuccess: (state, action) => {
      state.usersList = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.usersList = [];
      state.loading = false;
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { fetchUsersSuccess, fetchUsersFailure, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
