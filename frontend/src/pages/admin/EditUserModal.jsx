import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImageToCloudinary from '../../utils/cloudinaryUpload';


const EditUserModal = ({ user, closeModal, refetchUsers }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error('Name cannot be empty');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let profileImageUrl = user.profile_image;
      if (profileImage) {
        profileImageUrl = await uploadImageToCloudinary(profileImage);
      }

      const response = await axios.patch(
        `http://localhost:8000/admin/edit-user/${user.user_id}/`,
        {
          first_name: firstName,
          email,
          profile_image: profileImageUrl,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('User updated successfully');
        closeModal();
        refetchUsers();
      }
    } catch (err) {
      if (err.response?.data?.email) {
        toast.error(err.response.data.email[0]);
      }
      else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      }
      else {
        toast.error('Failed to update user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update User'}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
