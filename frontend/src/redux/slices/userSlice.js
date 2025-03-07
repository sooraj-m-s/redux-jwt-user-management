import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user_id: null,
  email: '',
  first_name: '',
  profile_image: '',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin || false;
      state.user_id = action.payload.user_id;
      state.email = action.payload.email;
      state.first_name = action.payload.first_name;
      state.profile_image = action.payload.profile_image;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.user_id = null;
      state.email = '';
      state.first_name = '';
      state.profile_image = '';
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.user_id = null;
      state.email = '';
      state.first_name = '';
      state.profile_image = '';
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, loginFailure, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
