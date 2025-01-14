import axios from "axios";
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true, // For cookies, if using Sanctum
    withXSRFToken: true,
})

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Retrieve token from localStorage or another secure source
        const token = localStorage.getItem('token') || ''; // Adjust based on your storage method
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Ensure the modified config is returned
    },
    (error) => {
        // Handle request error
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional)
axiosClient.interceptors.response.use(
    (response) => response, // Forward the response as is
    (error) => {
        // Handle response errors (e.g., token expiration, unauthorized access)
        if (error.response?.status === 401) {
            // Optional: Redirect to login page or logout
            console.error('Unauthorized! Redirecting to login...');
        }
        return Promise.reject(error);
    }
);
export { axiosClient as axios };