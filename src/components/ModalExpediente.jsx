import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalExpediente = ({ isOpen, onClose, onSave, estados, departamentos, clasificaciones, peticionarios, empresas, expediente }) => {
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
        peticionarioId: null,
        empresaId: null,
        fechaInicio: new Date(),
        expedienteSecundarioIds: []
    });

    const [isPeticionarioSelected, setIsPeticionarioSelected] = useState(true);

    useEffect(() => {
        if (expediente && expediente.id > 0) {
            // When modifying, set the form data from the existing expediente
            setFormData(prevFormData => ({
                ...prevFormData,
                ...expediente,
                fechaRegistro: expediente.fechaRegistro ? new Date(expediente.fechaRegistro) : new Date(),
                estadoExpedienteId: expediente.estadoExpedienteId || (expediente.estadoExpediente ? expediente.estadoExpediente.id : null),
                departamentoId: expediente.departamentoId || (expediente.departamento ? expediente.departamento.id : null),
                clasificacionId: expediente.clasificacionId || (expediente.clasificacion ? expediente.clasificacion.id : null),
                peticionarioId: expediente.peticionarioId || null,
                empresaId: expediente.empresaId || null,
                fechaInicio: expediente.fechaInicio ? new Date(expediente.fechaInicio) : new Date()
            }));
            setIsPeticionarioSelected(expediente.peticionarioId !== null);
        } else {
            // When adding new, reset the form
            resetForm();
            setIsPeticionarioSelected(true);
        }
    }, [expediente, isOpen]); // This ensures reset happens when modal opens for new items

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
            peticionarioId: null,
            empresaId: null,
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
            [name]: selectedOption ? selectedOption.id : null
        }));
        console.log(selectedOption);
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
            estadoExpedienteId: formData.estadoExpedienteId,
            departamentoId: formData.departamentoId,
            clasificacionId: formData.clasificacionId,
            peticionarioId: isPeticionarioSelected ? formData.peticionarioId : null,
            empresaId: !isPeticionarioSelected ? formData.empresaId : null,
            expedienteSecundarioIds: []
        };

        if (!expediente || !expediente.id) {
            delete dataToSend.id;
        }

        onSave(dataToSend);
        resetForm();
    };

    if (!isOpen) return null;
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                <h2>{expediente && expediente.id ? 'Modificar Expediente' : 'Añadir Nuevo Expediente'}</h2>
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
                        Referencia Catastral:
                        <input type="text" name="referenciaCatastral" value={formData.referenciaCatastral} onChange={handleChange} />
                    </label>
                    <label>
                        Estado Expediente:
                        <Select
                            name="estadoExpediente"
                            options={estados}
                            value={estados.find(option => option.id === formData.estadoExpedienteId)}
                            onChange={(option) => handleSelectChange(option, { name: 'estadoExpedienteId' })}
                        />
                    </label>
                    <label>
                        Departamento:
                        <Select
                            name="departamento"
                            options={departamentos}
                            value={departamentos.find(option => option.id === formData.departamentoId)}
                            onChange={(option) => handleSelectChange(option, { name: 'departamentoId' })}
                        />
                    </label>
                    <label>
                        Clasificación:
                        <Select
                            name="clasificacion"
                            options={clasificaciones}
                            value={clasificaciones.find(option => option.id === formData.clasificacionId)}
                            onChange={(option) => handleSelectChange(option, { name: 'clasificacionId' })}
                        />
                    </label>
                    <div>
                        <label>
                            <input 
                                type="radio" 
                                name="tipoPeticionario" 
                                value="peticionario" 
                                checked={isPeticionarioSelected} 
                                onChange={() => setIsPeticionarioSelected(true)} 
                            />
                            Peticionario
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="tipoPeticionario" 
                                value="empresa" 
                                checked={!isPeticionarioSelected} 
                                onChange={() => setIsPeticionarioSelected(false)} 
                            />
                            Empresa
                        </label>
                    </div>
                    {isPeticionarioSelected ? 
                        <label>
                            Peticionario:
                            <Select
                                name="peticionario"
                                options={peticionarios.map(p => ({ id: p.id, label: `${p.name} ${p.surname || ''} - ${p.dni || p.cif}` }))}
                                value={peticionarios.find(p => p.id === formData.peticionarioId)}
                                onChange={(option) => handleSelectChange(option, { name: 'peticionarioId' })}
                            />
                        </label>
                    : 
                        <label>
                            Empresa:
                            <Select
                                name="empresa"
                                options={empresas.map(e => ({ id: e.id, label: `${e.name} - ${e.cif}` }))}
                                value={empresas.find(e => e.id === formData.empresaId)}
                                onChange={(option) => handleSelectChange(option, { name: 'empresaId' })}
                            />
                        </label>
                    }
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