// src/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post('http://localhost:9000/api/login', null, {
                params: {
                    username: credentials.username,
                    password: credentials.password,
                },
            });
    
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
    
                // // Guardar preferencias del usuario (puedes tener este endpoint configurado)
                // const preferencesResponse = await axios.get('http://localhost:9000/api/user/preferences', {
                //     headers: {
                //         Authorization: `Bearer ${response.data.token}`,
                //     },
                // });
    
                // localStorage.setItem('preferences', JSON.stringify(preferencesResponse.data));
    
                // Guardar nombre de usuario
                localStorage.setItem('username', credentials.username);
                navigate('/dashboard');
            } else {
                setError('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Error en el inicio de sesión');
            } else {
                setError('Error en el inicio de sesión. Inténtalo de nuevo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-700 mb-6">GestExp</h1>
            
            <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Introduce tu usuario"
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Introduce tu contraseña"
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 bg-transparent rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
