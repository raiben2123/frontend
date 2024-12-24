import React, { useState, useEffect } from 'react';
import '../css/ModalPeticionarios.css';
import ModalEmpresas from './ModalEmpresas';

const ModalPeticionarios = ({ isOpen, onClose, onAdd, onUpdate, peticionario, empresas = [] }) => {
    const [formData, setFormData] = useState({
        identificacion: '',
        name: '',
        surname: '',
        tlf: '',
        email: '',
        address: '',
        representa: {
            cif: ''
        },
        empresaCIF: '', // Campo para el CIF de la empresa
        tipo_peticionario: 'DNI' // Default to 'DNI'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalEmpresaOpen, setIsModalEmpresaOpen] = useState(false);
    const [currentPeticionario, setCurrentPeticionario] = useState(null);
    const [isPeticionarioModalVisible, setIsPeticionarioModalVisible] = useState(isOpen);

    useEffect(() => {
        if (peticionario) {
            setFormData({
                identificacion: peticionario.dni || peticionario.nif || '',
                name: peticionario.name || '',
                surname: peticionario.surname || '',
                tlf: peticionario.tlf || '',
                email: peticionario.email || '',
                address: peticionario.address || '',
                representa: peticionario.representa || {
                    cif: ''
                },
                empresaCIF: peticionario.representa?.cif || '', // Campo para el CIF de la empresa
                tipo_peticionario: peticionario.dni ? 'DNI' : 'NIF'
            });
        } else {
            resetForm();
        }
    }, [peticionario]);

    useEffect(() => {
        setIsPeticionarioModalVisible(isOpen);
    }, [isOpen]);

    const resetForm = () => {
        setFormData({
            identificacion: '',
            name: '',
            surname: '',
            tlf: '',
            email: '',
            address: '',
            representa: {
                cif: ''
            },
            empresaCIF: '', // Campo para el CIF de la empresa
            tipo_peticionario: 'DNI'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('representa.')) {
            const key = name.split('.')[1];
            setFormData((prevFormData) => ({
                ...prevFormData,
                representa: {
                    ...prevFormData.representa,
                    [key]: value
                }
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value
            }));

            if (name === 'identificacion') {
                if (/^[A-Z]\d{8}[A-Z]$/.test(value)) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        tipo_peticionario: 'NIF'
                    }));
                } else if (/^\d{8}[A-Z]$/.test(value)) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        tipo_peticionario: 'DNI'
                    }));
                }
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8081/api/empresas/cif/${formData.empresaCIF}`);
            const empresas = await response.json();

            if (empresas.length === 0 && formData.empresaCIF.trim()) {
                // Si no se encuentra una empresa con el CIF proporcionado, abrir el modal para crearla
                setCurrentPeticionario(formData);
                setIsModalEmpresaOpen(true);
                setIsPeticionarioModalVisible(false);
            } else {
                // Si el CIF existe o no se proporciona CIF, proceder con las operaciones del peticionario
                const peticionarioData = {
                    tipo_peticionario: formData.tipo_peticionario,
                    name: formData.name,
                    surname: formData.surname,
                    address: formData.address,
                    tlf: formData.tlf,
                    email: formData.email
                };

                if (formData.tipo_peticionario === 'DNI') {
                    peticionarioData.dni = formData.identificacion;
                } else if (formData.tipo_peticionario === 'NIF') {
                    peticionarioData.nif = formData.identificacion;
                }

                if (formData.empresaCIF.trim()) {
                    peticionarioData.representa = {
                        cif: formData.empresaCIF
                    };
                }

                if (peticionario && peticionario.id) {
                    await onUpdate({ ...peticionarioData, id: peticionario.id });
                } else {
                    await onAdd(peticionarioData);
                }
                onClose();
            }
        } catch (error) {
            setError('Error al comprobar o guardar los datos del peticionario');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateEmpresa = async (empresaData) => {
        try {
            const response = await fetch('http://localhost:8081/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });
            const newEmpresa = await response.json();
            setFormData((prevFormData) => ({
                ...prevFormData,
                empresaCIF: newEmpresa.cif,
                representa: {
                    cif: newEmpresa.cif
                }
            }));
            setIsModalEmpresaOpen(false);
            setIsPeticionarioModalVisible(true);
            // Actualizar la lista de empresas en el frontend
            empresas.push(newEmpresa);
            handleSubmit(); // Re-submit to add peticionario with the new company
        } catch (error) {
            console.error('Error adding empresa:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isPeticionarioModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>&times;</span>
                        <h2>{peticionario ? 'Modificar Peticionario' : 'Añadir Nuevo Peticionario'}</h2>
                        {error && <p className="error">{error}</p>}
                        <form>
                            <label>
                                Identificación:
                                <input
                                    type="text"
                                    name="identificacion"
                                    value={formData.identificacion}
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
                                Apellido:
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
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
                                CIF de la Empresa:
                                <input
                                    type="text"
                                    name="empresaCIF"
                                    value={formData.empresaCIF}
                                    onChange={handleChange}
                                />
                            </label>
                            <button type="button" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isModalEmpresaOpen && (
                <ModalEmpresas
                    isOpen={isModalEmpresaOpen}
                    onClose={() => {
                        setIsModalEmpresaOpen(false);
                        setIsPeticionarioModalVisible(true);
                    }}
                    onAddOrUpdate={handleAddOrUpdateEmpresa}
                    empresa={null}
                    peticionario={currentPeticionario}
                    actualizarPeticionario={(peticionario, empresa) => {
                        if (empresa) {
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                representa: {
                                    cif: empresa.cif
                                }
                            }));
                        }
                        setIsModalEmpresaOpen(false);
                        setIsPeticionarioModalVisible(true);
                    }}
                />
            )}
        </>
    );
};

export default ModalPeticionarios;