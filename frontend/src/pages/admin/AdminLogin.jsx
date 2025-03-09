import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess, setLoading } from '../../redux/slices/userSlice';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required');
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/admin/login/', { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data;
        dispatch(
          loginSuccess({
            user_id: userData.user_id,
            email: userData.email,
            first_name: userData.first_name,
            profile_image: userData.profile_image,
            isAdmin: userData.isAdmin
          })
        );
        toast.success('Login successful');
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Admin login error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Admin Login</h2>

        {loading && <p className="text-center text-blue-400">Loading...</p>}

        <div className="mb-4">
          <label className="block text-gray-300">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded mt-1 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-500 transition duration-200"
          disabled={loading}
        >{loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
