import React, { useState, useEffect } from 'react';
import '../css/ModalPeticionarios.css';

const ModalEmpresas = ({ isOpen, onClose, onAddOrUpdate, empresa, peticionario, actualizarPeticionario }) => {
    const [formData, setFormData] = useState({
        cif: '',
        name: '',
        address: '',
        tlf: '',
        email: ''
    });

    useEffect(() => {
        if (empresa) {
            setFormData({
                cif: empresa.cif || '',
                name: empresa.name || '',
                address: empresa.address || '',
                tlf: empresa.tlf || '',
                email: empresa.email || ''
            });
        }
    }, [empresa]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.cif.trim() || !formData.name.trim()) {
            setError('El CIF y el nombre no pueden estar vacíos');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newEmpresa = await onAddOrUpdate(formData);
            actualizarPeticionario(peticionario, newEmpresa);
            onClose();
        } catch (error) {
            setError('Error al guardar la empresa');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{empresa ? 'Modificar Empresa' : 'Añadir Nueva Empresa'}</h2>
                {error && <p className="error">{error}</p>}
                <form>
                    <label>
                        CIF:
                        <input
                            type="text"
                            name="cif"
                            value={formData.cif}
                            onChange={handleChange}
                        />
                    </label>
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
                        Dirección:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="tlf"
                            value={formData.tlf}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalEmpresas;