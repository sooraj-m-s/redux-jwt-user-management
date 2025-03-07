import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/userSlice';
import axios from 'axios';


const UserDashboard = () => {
  const { first_name, email, profile_image, isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/logout/', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout());
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {first_name}!</h1>
        <p className="text-gray-700">Email: {email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserDashboard
