import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, loginFailure, setLoading } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      toast.error('Email cannot be empty');
      return false;
    }
    if (!password.trim()) {
      toast.error('Password cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    if (!validateForm()) {
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/login/', {email, password}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const userData = response.data;
        dispatch(loginSuccess({
          user_id: userData.user_id,
          email: userData.email,
          first_name: userData.first_name,
          profile_image: userData.profile_image,
          isAdmin: userData.is_superuser || false,
        }));
        toast.success('Login successful!');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {loading && <p className="text-center text-blue-500">Loading...</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1 pr-10"/>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;
