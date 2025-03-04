import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/authSlice';
import axios from 'axios';


function Profile() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (username !== user.username) formData.append('username', username);
    if (email !== user.email) formData.append('email', email);
    if (profileImage) formData.append('profile_image', profileImage);

    try {
      await axios.put('http://localhost:8000/api/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {user?.profile_image && (
            <img
              src={user.profile_image}
              alt="Profile"
              className="mt-4 w-32 h-32 rounded-full object-cover mx-auto"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
