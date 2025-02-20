// src/axiosConfig.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9000/api', // Cambia esto a tu URL base
});

// Interceptor para añadir el token en cada solicitud
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Añade el token al encabezado Authorization
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
