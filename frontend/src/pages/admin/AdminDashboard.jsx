import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, fetchUsersSuccess, fetchUsersFailure } from '../../redux/slices/adminSlice';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { admin, usersList, loading, error } = useSelector((state) => state.admin);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('http://localhost:8000/admin/dashboard/', {
        withCredentials: true,
      });
      dispatch(fetchUsersSuccess(response.data));
    } catch (err) {
      dispatch(fetchUsersFailure(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 dark">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {admin && (
          <div className="flex items-center space-x-4">
            <img src={admin.profile_image} className="w-12 h-12 rounded-full object-cover"/>
            <div>
              <p className="font-semibold">{admin.first_name}</p>
            </div>
          </div>
        )}
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleCreateUser}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 transition duration-200"
      >
        Create New User
      </button>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-gray-800 rounded">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-1 py-2 text-left">Photo</th>
              <th className="px-5 py-2 text-left">Name</th>
              <th className="px-5 py-2 text-left">Email</th>
              <th className="px-1 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user.user_id} className="border-b border-gray-700 hover:bg-gray-600">
                <td className="px-1 py-2"><img src={user.profile_image} className="w-12 h-12 rounded-full object-cover"/></td>
                <td className="px-5 py-2">{user.first_name}</td>
                <td className="px-5 py-2">{user.email}</td>
                <td className="px-1 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCreateModalOpen && <CreateUserModal closeModal={closeModals} refetchUsers={fetchUsers} />}
      {isEditModalOpen && (
        <EditUserModal user={selectedUser} closeModal={closeModals} refetchUsers={fetchUsers} />
      )}
      {isDeleteModalOpen && (
        <DeleteUserModal user={userToDelete} closeModal={closeDeleteModal} refetchUsers={fetchUsers}/>
      )}
    </div>
  );
};

export default AdminDashboard;
