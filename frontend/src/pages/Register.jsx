import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import uploadImageToCloudinary from '../utils/cloudinaryUpload';


const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
    profile_image: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log('name: ', name, 'value: ', value, 'files: ', files)
    if (name === 'profile_image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      toast.error('First name cannot be empty');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8 || /\s/.test(formData.password)) {
      toast.error('Password must be at least 8 characters and cannot contain spaces');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
        setLoading(false);
        return;
    }

    try {
      const profileImageUrl = await uploadImageToCloudinary(formData.profile_image);

      const registrationData = {
        first_name: formData.first_name,
        email: formData.email,
        password: formData.password,
        profile_image: profileImageUrl || '',
      };

      const response = await axios.post(
        'http://localhost:8000/register/',
        registrationData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        toast.success('Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="profile_image">
              Profile Image
            </label>
            <input
              type="file"
              name="profile_image"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
