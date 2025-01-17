// PeticionariosContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchPeticionarios } from '../api/apiService'; // Asegúrate de que la ruta a tu servicio es correcta

export const PeticionariosContext = createContext();

export const PeticionariosProvider = ({ children }) => {
    const [peticionarios, setPeticionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchPeticionarios();
                setPeticionarios(data);
            } catch (error) {
                console.error('Error al cargar peticionarios:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshPeticionarios = async () => {
        try {
            const data = await fetchPeticionarios();
            setPeticionarios(data);
        } catch (error) {
            console.error('Error al refrescar peticionarios:', error);
        }
    };

    return (
        <PeticionariosContext.Provider value={{ peticionarios, loading, refreshPeticionarios }}>
            {children}
        </PeticionariosContext.Provider>
    );
};