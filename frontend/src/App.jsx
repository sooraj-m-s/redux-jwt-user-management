import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import { loginSuccess, logout, setLoading } from './redux/slices/userSlice';
import { useEffect } from 'react';
import axios from 'axios';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated && !loading) {
        dispatch(setLoading(true));
        try {
          const response = await axios.get('http://localhost:8000/dashboard/', {
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
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          dispatch(logout());
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchUserData();
  }, [dispatch, isAuthenticated, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
