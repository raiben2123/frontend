import React, { useState, useEffect } from "react";

const ModalDepartamentos = ({ isOpen, onClose, onAdd, onUpdate, departamento }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [error, setError] = useState(''); // Estado para manejar el error

    useEffect(() => {
        if (departamento) {
            setFormData({
                id: departamento.id || null,
                name: departamento.name || '',
            });
            setError(''); // Resetea el error si se abre el modal para modificar
        } else {
            setFormData({ name: '' });
            setError(''); // Resetea el error si se abre el modal para añadir
        }
    }, [departamento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(''); // Resetea el error al cambiar el nombre
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
            setFormData({ name: '' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{departamento ? 'Modificar Departamento' : 'Añadir Departamento'}</h2>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                {error && <div className="error">{error}</div>} {/* Muestra el mensaje de error */}
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default ModalDepartamentos;