import axios from 'axios';
import { toast } from 'react-toastify';


// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Include cookies in requests
});

// Store requests that are waiting for a token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request headers if needed (e.g., Authorization header)
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and the request hasn’t been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using the refresh_token cookie
        const response = await axios.post(
          'http://localhost:8000/token/refresh/',
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          // The backend should set the new access_token in the cookie
          // Notify the queue that the token has been refreshed
          processQueue(null);
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid or expired
        processQueue(refreshError);
        toast.error('Session expired. Please log in again.');
        // Dispatch logout action (you'll need to import dispatch and logout from your userSlice)
        // For now, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If the error is not a 401 or token refresh fails, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
