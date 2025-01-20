import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalExpedienteSecundario = ({ isOpen, onClose, onSave, estados, departamentos, clasificaciones, peticionarios, empresas, expedientesPrincipales, expediente }) => {
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
        expedientePrincipalId: null
    });

    const [isPeticionarioSelected, setIsPeticionarioSelected] = useState(true);

    useEffect(() => {
        if (expediente && expediente.id > 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                ...expediente,
                fechaRegistro: expediente.fechaRegistro ? new Date(expediente.fechaRegistro) : new Date(),
                estadoExpedienteId: expediente.estadoExpedienteId || (expediente.estadoExpediente ? expediente.estadoExpediente.id : null),
                departamentoId: expediente.departamentoId || (expediente.departamento ? expediente.departamento.id : null),
                clasificacionId: expediente.clasificacionId || (expediente.clasificacion ? expediente.clasificacion.id : null),
                peticionarioId: expediente.peticionarioId || null,
                empresaId: expediente.empresaId || null,
                fechaInicio: expediente.fechaInicio ? new Date(expediente.fechaInicio) : new Date(),
                expedientePrincipalId: expediente.expedientePrincipalId || null
            }));
            setIsPeticionarioSelected(expediente.peticionarioId !== null);
        } else {
            resetForm();
            setIsPeticionarioSelected(true);
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
            peticionarioId: null,
            empresaId: null,
            fechaInicio: new Date(),
            expedientePrincipalId: null
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
            expedientePrincipalId: formData.expedientePrincipalId
        };

        if (!expediente || !expediente.id) {
            delete dataToSend.id;
        }

        onSave(dataToSend);
    };

    if (!isOpen) return null;
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                <h2>{expediente && expediente.id ? 'Modificar Expediente Secundario' : 'Añadir Nuevo Expediente Secundario'}</h2>
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
                                options={peticionarios.map(p => ({ id: p.id, label: `${p.name} ${p.surname || ''} - ${p.dni || ''}` }))}
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
                    <label>
                        Expediente Principal:
                        <Select
                            name="expedientePrincipal"
                            options={expedientesPrincipales.map(ep => ({ id: ep.id, label: ep.expediente }))}
                            value={expedientesPrincipales.find(ep => ep.id === formData.expedientePrincipalId)}
                            onChange={(option) => handleSelectChange(option, { name: 'expedientePrincipalId' })}
                        />
                    </label>
                    <button type="button" onClick={handleSubmit}>Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default ModalExpedienteSecundario;