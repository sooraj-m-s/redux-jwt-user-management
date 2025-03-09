import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/slices/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImageToCloudinary from '../utils/cloudinaryUpload';


const UserDashboard = () => {
  const { first_name, email, profile_image, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(first_name || '');
  const [editProfileImage, setEditProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!editFirstName.trim()) {
      toast.error('Name cannot be empty');
      setSaving(false);
      return;
    }

    let newProfileImageUrl = profile_image;
    if (editProfileImage) {
      newProfileImageUrl = await uploadImageToCloudinary(editProfileImage);
      if (!newProfileImageUrl) {
        setSaving(false);
        return;
      }
    }

    try {
      const response = await axios.patch(
        'http://localhost:8000/dashboard/',
        {
          first_name: editFirstName,
          profile_image: newProfileImageUrl,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(
          loginSuccess({
            first_name: editFirstName,
            email,
            profile_image: newProfileImageUrl,
            isAuthenticated,
            isAdmin: response.data.isAdmin || false,
          })
        );
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile.');
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditProfileImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Welcome, {first_name || 'User'}!</h1>
            <img src={profile_image} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"/>
            <p className="text-gray-700">Email: {email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
