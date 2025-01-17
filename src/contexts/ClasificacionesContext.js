// ClasificacionesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchClasificaciones } from '../api/apiService'; // Asegúrate de importar tu función de fetch

export const ClasificacionesContext = createContext();

export const ClasificacionesProvider = ({ children }) => {
    const [clasificaciones, setClasificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchClasificaciones();
                setClasificaciones(data);
            } catch (error) {
                console.error('Error al cargar clasificaciones:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshClasificaciones = async () => {
        try {
            const data = await fetchClasificaciones();
            setClasificaciones(data);
        } catch (error) {
            console.error('Error al refrescar clasificaciones:', error);
        }
    };

    return (
        <ClasificacionesContext.Provider value={{ clasificaciones, loading, refreshClasificaciones }}>
            {children}
        </ClasificacionesContext.Provider>
    );
};