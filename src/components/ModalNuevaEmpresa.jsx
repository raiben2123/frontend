import React, { useState } from 'react';
import '../css/ModalNuevaEmpresa.css';

const ModalNuevaEmpresa = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        cif: '',
        name: '',
        address: '',
        tlf: '',
        email: '',
        representante: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Añadir Nueva Empresa</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        CIF:
                        <input
                            type="text"
                            name="cif"
                            value={formData.cif}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Dirección:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            name="tlf"
                            value={formData.tlf}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Representante:
                        <input
                            type="text"
                            name="representante"
                            value={formData.representante}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="modal-footer">
                        <button type="submit">Añadir</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNuevaEmpresa;