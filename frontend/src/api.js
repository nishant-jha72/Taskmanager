import axios from 'axios';
import dotenv from 'dotenv';
const api = axios.create({
    baseURL : import.meta.env.VITE_APP_API_URL,
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
