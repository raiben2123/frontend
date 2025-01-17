import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalExpediente = ({ isOpen, onClose, onSave, estados, departamentos, clasificaciones, peticionarios, expediente }) => {
    const [formData, setFormData] = useState({
        expediente: '',
        solicitud: '',
        registro: '',
        fechaRegistro: new Date(),
        objeto: '',
        referenciaCatastral: '',
        estadoExpedienteId: null,
        departamentoId: null,
        clasificacionId: null,
        empresaId: null,
        peticionarioId: null,
        fechaInicio: new Date(),
        expedienteSecundarioIds: []
    });

    useEffect(() => {
        if (expediente) {
            setFormData(prevFormData => ({
                ...prevFormData,
                ...expediente,
                fechaRegistro: expediente.fechaRegistro ? new Date(expediente.fechaRegistro) : new Date(),
                estadoExpedienteId: expediente.estadoExpediente ? expediente.estadoExpediente.id : null,
                departamentoId: expediente.departamento ? expediente.departamento.id : null,
                clasificacionId: expediente.clasificacion ? expediente.clasificacion.id : null,
                empresaId: expediente.empresa ? expediente.empresa.id : null,
                peticionarioId: expediente.peticionario ? expediente.peticionario.id : null,
                fechaInicio: expediente.fechaInicio ? new Date(expediente.fechaInicio) : new Date()
            }));
        } else {
            resetForm();
        }
    }, [expediente, isOpen]);

    const resetForm = () => {
        setFormData({
            expediente: '',
            solicitud: '',
            registro: '',
            fechaRegistro: new Date(),
            objeto: '',
            referenciaCatastral: '',
            estadoExpedienteId: null,
            departamentoId: null,
            clasificacionId: null,
            empresaId: null,
            peticionarioId: null,
            fechaInicio: new Date(),
            expedienteSecundarioIds: []
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name + 'Id']: selectedOption ? selectedOption.value : null // Aseguramos que el ID se usa
        }));
    };

    const handleDateChange = (date, name) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: date
        }));
    };

    const handleSubmit = () => {
        const dataToSend = {
            ...formData,
            fechaRegistro: formData.fechaRegistro.toISOString(),
            fechaInicio: formData.fechaInicio.toISOString(),
            expedienteSecundarioIds: []
        };
        
        delete dataToSend.id;

        onSave(dataToSend);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                <h2>{expediente ? 'Modificar Expediente' : 'Añadir Nuevo Expediente'}</h2>
                <form>
                    <label>
                        Expediente:
                        <input type="text" name="expediente" value={formData.expediente} onChange={handleChange} />
                    </label>
                    <label>
                        Solicitud:
                        <input type="text" name="solicitud" value={formData.solicitud} onChange={handleChange} />
                    </label>
                    <label>
                        Registro:
                        <input type="text" name="registro" value={formData.registro} onChange={handleChange} />
                    </label>
                    <label>
                        Fecha de Registro:
                        <DatePicker selected={formData.fechaRegistro} onChange={(date) => handleDateChange(date, 'fechaRegistro')} />
                    </label>
                    <label>
                        Objeto:
                        <input type="text" name="objeto" value={formData.objeto} onChange={handleChange} />
                    </label>
                    <label>
                        Referencia Catastral:
                        <input type="text" name="referenciaCatastral" value={formData.referenciaCatastral} onChange={handleChange} />
                    </label>
                    <label>
                        Estado Expediente:
                        <Select
                            name="estadoExpediente"
                            options={estados}
                            value={estados.find(option => option.value === formData.estadoExpedienteId)}
                            onChange={handleSelectChange}
                        />
                    </label>
                    <label>
                        Departamento:
                        <Select
                            name="departamento"
                            options={departamentos}
                            value={departamentos.find(option => option.value === formData.departamentoId)}
                            onChange={handleSelectChange}
                        />
                    </label>
                    <label>
                        Clasificación:
                        <Select
                            name="clasificacion"
                            options={clasificaciones}
                            value={clasificaciones.find(option => option.value === formData.clasificacionId)}
                            onChange={handleSelectChange}
                        />
                    </label>
                    <label>
                        Peticionario:
                        <Select
                            name="peticionario"
                            options={peticionarios}
                            value={peticionarios.find(option => option.value === formData.peticionarioId)}
                            onChange={handleSelectChange}
                        />
                    </label>
                    <label>
                        Fecha de Inicio:
                        <DatePicker selected={formData.fechaInicio} onChange={(date) => handleDateChange(date, 'fechaInicio')} />
                    </label>
                    <button type="button" onClick={handleSubmit}>Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default ModalExpediente;