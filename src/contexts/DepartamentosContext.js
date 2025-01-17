// DepartamentosContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchDepartamentos } from '../api/apiService'; // Asegúrate de que la ruta a tu servicio es correcta

export const DepartamentosContext = createContext();

export const DepartamentosProvider = ({ children }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchDepartamentos();
                setDepartamentos(data);
            } catch (error) {
                console.error('Error al cargar departamentos:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshDepartamentos = async () => {
        try {
            const data = await fetchDepartamentos();
            setDepartamentos(data);
        } catch (error) {
            console.error('Error al refrescar departamentos:', error);
        }
    };

    return (
        <DepartamentosContext.Provider value={{ departamentos, loading, refreshDepartamentos }}>
            {children}
        </DepartamentosContext.Provider>
    );
};