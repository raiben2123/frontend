// EstadosContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchEstados } from '../api/apiService'; // Asegúrate de que la ruta a tu servicio es correcta

export const EstadosContext = createContext();

export const EstadosProvider = ({ children }) => {
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchEstados();
                setEstados(data);
            } catch (error) {
                console.error('Error al cargar estados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshEstados = async () => {
        try {
            const data = await fetchEstados();
            setEstados(data);
        } catch (error) {
            console.error('Error al refrescar estados:', error);
        }
    };

    return (
        <EstadosContext.Provider value={{ estados, loading, refreshEstados }}>
            {children}
        </EstadosContext.Provider>
    );
};