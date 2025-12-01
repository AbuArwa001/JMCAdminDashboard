import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Check for token in localStorage (or you could use next-auth session)
        // For now, let's assume we store it in localStorage after login
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('firebaseToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized (Token expired)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh token here if you implement refresh logic
            // For now, we'll just logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('firebaseToken');
                localStorage.removeItem('firebaseUser');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
