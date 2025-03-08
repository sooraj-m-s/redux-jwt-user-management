import axios from "axios";
import { loginSuccess, logout, setLoading } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);
  
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
                    setAuthChecked(true);
                }
            } else {
                setAuthChecked(true);
            }
        };
        fetchUserData();
    }, [dispatch, isAuthenticated, loading]);
  
    if (loading || !authChecked) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
  
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute
