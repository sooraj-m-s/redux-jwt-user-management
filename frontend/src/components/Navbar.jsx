import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/userSlice';


function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/logout/', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-semibold">MyApp</Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white hover:text-gray-200 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="text-white hover:text-gray-200 transition">Login</Link>
              )}
              <Link to="/register" className="text-white hover:text-gray-200 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
