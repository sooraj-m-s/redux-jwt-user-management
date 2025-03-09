import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DeleteUserModal = ({ user, closeModal, refetchUsers }) => {
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    dispatch(setLoading(true));
    try {
      await axios.patch(
        `http://localhost:8000/admin/edit-user/${user.user_id}/`,
        { status: 'Blocked' },
        { withCredentials: true }
      );
      toast.success('User deleted successfully');
      closeModal();
      refetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Confirm Delete User</h2>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete {user.first_name}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleConfirmDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Yes, Delete
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
