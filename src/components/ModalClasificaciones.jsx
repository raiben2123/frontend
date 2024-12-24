import React, { useState, useEffect } from "react";
import '../css/ModalClasificaciones.css'

const ModalClasificaciones = ({ isOpen, onClose, onAdd, onUpdate, clasificacion }) => {
    const [formData, setFormData] = useState({ name: '', acronym: '' });
        const [error, setError] = useState(''); // Estado para manejar el error

    useEffect(() => {
        if (clasificacion) {
            setFormData({
                id: clasificacion.id || null,
                name: clasificacion.name || '',
                acronym: clasificacion.acronym || '',
            });
        } else {
            setFormData({ name: '', acronym: '' });
        }
    }, [clasificacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) { // Verifica si el nombre está vacío
            setError('El nombre no puede estar vacío');
            return; // No se ejecuta onAdd ni onUpdate
        }
        
        if (formData.id) {
            onUpdate(formData);
        } else {
            onAdd(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{clasificacion ? 'Modificar Clasificación' : 'Añadir Clasificación'}</h2>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Siglas:
                    <input
                        type="text"
                        name="acronym"
                        value={formData.acronym}
                        onChange={handleChange}
                    />
                </label>
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default ModalClasificaciones;
