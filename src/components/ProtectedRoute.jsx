import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // si no hay token, redirige al login
        return <Navigate to="/login" replace />;
    }
    // si hay token, permite el acceso a la ruta
    return children;
};

export default ProtectedRoute;