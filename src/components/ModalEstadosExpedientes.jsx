import React, { useState, useEffect } from "react";
import '../css/ModalClasificaciones.css'; // Asegúrate de tener el CSS correspondiente

const ModalEstadosExpedientes = ({ isOpen, onClose, onAdd, onUpdate, estadosExpedientes }) => {
    const [formData, setFormData] = useState({ name: '' });
        const [error, setError] = useState(''); // Estado para manejar el error

    useEffect(() => {
        if (estadosExpedientes) {
            setFormData({
                id: estadosExpedientes.id || null,
                name: estadosExpedientes.name || '',
            });
        } else {
            setFormData({ name: '' });
        }
    }, [estadosExpedientes]);

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
                <h2>{estadosExpedientes ? 'Modificar Estado' : 'Añadir Estado'}</h2>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default ModalEstadosExpedientes;
