import React, { useState, useEffect } from "react";
import '../css/MainExpedientesPrincipales.css';
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalExpediente from './ModalExpediente';

const MainExpedientesPrincipales = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [columns, setColumns] = useState([
        { id: 'solicitud', label: 'Solicitud' },
        { id: 'registro', label: 'Registro' },
        { id: 'fechaRegistro', label: 'Fecha de registro' },
        { id: 'expediente', label: 'Expediente' },
        { id: 'peticionario', label: 'Peticionario' },
        { id: 'referenciaCatastral', label: 'Referencia Catastral' },
        { id: 'estadoExp', label: 'Estado Exp' },
        { id: 'departamento', label: 'Departamento' },
        { id: 'clasificacion', label: 'Clasificación' },
        { id: 'modificar', label: 'Modificar' }
    ]);
    const [expedientes, setExpedientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [estados, setEstados] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);
    const [peticionarios, setPeticionarios] = useState([]);
    const [expedienteToModify, setExpedienteToModify] = useState(null);
    const [loading, setLoading] = useState(false); // Nuevo estado para manejo de carga

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true); // Indicar que estamos cargando datos
        try {
            await Promise.all([
                fetchExpedientes(),
                fetchEstados(),
                fetchDepartamentos(),
                fetchClasificaciones(),
                fetchPeticionarios()
            ]);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false); // Fin de la carga de datos
        }
    };

    const fetchExpedientes = async () => {
        const response = await fetch(`http://localhost:8081/api/expedientesprincipales`);
        const data = await response.json();
        setExpedientes(data.map(expediente => ({
            ...expediente,
            peticionario: {
                id: expediente.peticionario?.id ?? null,
                name: expediente.peticionario?.name ?? 'N/A',
                surname: expediente.peticionario?.surname ?? 'N/A',
                tipo_peticionario: expediente.peticionario?.tipo_peticionario ?? 'N/A'
            },
            fechaRegistro: expediente.fechaRegistro ? new Date(expediente.fechaRegistro) : null,
            estadoExp: expediente.estadoExpediente ? {
                id: expediente.estadoExpediente.id,
                name: expediente.estadoExpediente.name
            } : { id: null, name: 'N/A' },
            departamento: expediente.departamento ? {
                id: expediente.departamento.id,
                name: expediente.departamento.name
            } : { id: null, name: 'N/A' },
            clasificacion: expediente.clasificacion ? {
                id: expediente.clasificacion.id,
                name: expediente.clasificacion.name,
                acronym: expediente.clasificacion.acronym || 'N/A' // Usamos OR si acronym no está presente
            } : { id: null, name: 'N/A', acronym: 'N/A' }
        })));
    };

    const fetchEstados = async () => {
        const response = await fetch('http://localhost:8081/api/estadosexpedientes');
        const data = await response.json();
        setEstados(data.map(estado => ({ value: estado.id, label: estado.name })));
    };

    const fetchDepartamentos = async () => {
        const response = await fetch('http://localhost:8081/api/departamentos');
        const data = await response.json();
        setDepartamentos(data.map(departamento => ({ value: departamento.id, label: departamento.name })));
    };

    const fetchClasificaciones = async () => {
        const response = await fetch('http://localhost:8081/api/clasificaciones');
        const data = await response.json();
        setClasificaciones(data.map(clasificacion => ({ value: clasificacion.id, label: `${clasificacion.name} - ${clasificacion.acronym}` })));
    };

    const fetchPeticionarios = async () => {
        const response = await fetch('http://localhost:8081/api/peticionarios');
        const data = await response.json();
        setPeticionarios(
            data.map(peticionario => ({
                value: peticionario.id,
                label: `${peticionario.name} ${peticionario.surname} - ${peticionario.dni ?? peticionario.cif ?? 'N/A'}`,
                tipo_peticionario: peticionario.tipo_peticionario,
                name: peticionario.name,
                surname: peticionario.surname
            }))
        );
    };

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setColumns(columns => {
                const oldIndex = columns.findIndex(item => item.id === active.id);
                const newIndex = columns.findIndex(item => item.id === over.id);
                return arrayMove(columns, oldIndex, newIndex);
            });
        }
    };

    const handleAddNew = () => {
        setIsModalOpen(true);
        setExpedienteToModify(null);
    };

    const handleModify = (expediente) => {
        setExpedienteToModify({
            ...expediente,
            peticionario: {
                value: expediente.peticionario.id,
                label: `${expediente.peticionario.name} ${expediente.peticionario.surname}`,
                tipo_peticionario: expediente.peticionario.tipo_peticionario,
                name: expediente.peticionario.name,
                surname: expediente.peticionario.surname
            }
        });
        setIsModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            let response;
            if (expedienteToModify && expedienteToModify.id) { // Actualización
                response = await fetch(`http://localhost:8081/api/expedientesprincipales/${expedienteToModify.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, id: expedienteToModify.id })
                });
            } else { // Creación
                console.log('Creación:', data);
                response = await fetch('http://localhost:8081/api/expedientesprincipales', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            if (response.ok) {
                await fetchExpedientes(); // Actualizar la lista de expedientes
                setIsModalOpen(false);
                setExpedienteToModify(null);
            } else {
                console.error('Error al guardar o actualizar el expediente');
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error al guardar o actualizar el expediente:', error);
        }
    };

    const handleDelete = () => {
        console.log('Eliminar');
        // Implementa la lógica para eliminar aquí
    };

    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const formatDate = (date) => {
        if (!date) return '';
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };

    const filteredExpedientes = expedientes;
    const totalPages = Math.ceil(filteredExpedientes.length / itemsPerPage);
    const currentItems = filteredExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Cargando...</div>; // Indicador de carga

    return (
        <div id="MainExpedientesPrincipales" className={className}>
            <div id="Encabezado">
                <div id="EncabezadoTabla">
                    <h2>EXPEDIENTES PRINCIPALES</h2>
                    <div id="filtroContainer">
                        <input
                            type="text"
                            id="filtro"
                            className={filtroExpanded ? 'expanded' : ''}
                            onFocus={toggleFiltro}
                            onBlur={toggleFiltro}
                            placeholder="Buscar..."
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                        <table>
                            <thead>
                                <tr>
                                    {columns.map(column => (
                                        <SortableItem key={column.id} id={column.id}>
                                            {column.label}
                                        </SortableItem>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((expediente) => (
                                    <tr key={expediente.id}>
                                        {columns.map((column) => (
                                            <td key={`${expediente.id}-${column.id}`}>
                                                {column.id === 'fechaRegistro' ? 
                                                    formatDate(expediente.fechaRegistro)
                                                : column.id === 'peticionario' ? 
                                                    `${expediente.peticionario.name} ${expediente.peticionario.surname}`
                                                : column.id === 'referenciaCatastral' ? 
                                                    <a href={`https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCConCiud.aspx?del=30&mun=1&UrbRus=U&RefC=${expediente[column.id] || ''}&Apenom=&esBice=&RCBice1=&RCBice2=&DenoBice=&from=nuevoVisor&ZV=NO&anyoZV=`} target="_blank" rel="noopener noreferrer">
                                                        {expediente[column.id] || 'N/A'}
                                                    </a>
                                                : column.id === 'estadoExp' ? 
                                                    expediente.estadoExp.name
                                                : column.id === 'departamento' ? 
                                                    expediente.departamento.name
                                                : column.id === 'clasificacion' ? 
                                                    `${expediente.clasificacion.name} - ${expediente.clasificacion.acronym}`
                                                : column.id === 'modificar' ? 
                                                    <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleModify(expediente)}>Modificar</button>
                                                : expediente[column.id] || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </SortableContext>
                </DndContext>
                <div id="Paginacion">
                    <span>Página {currentPage} de {totalPages}</span>
                    <div id="Botones">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
                    </div>
                </div>
                <div id="Botones">
                    <button onClick={handleAddNew}>Añadir Nuevo</button>
                    <button onClick={handleDelete}>Eliminar</button>
                </div>
            </div>
            <ModalExpediente
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setExpedienteToModify(null);
                }}
                onSave={handleSave}
                estados={estados}
                departamentos={departamentos}
                clasificaciones={clasificaciones}
                peticionarios={peticionarios}
                expediente={expedienteToModify || {}}
            />
        </div>
    );
};

export default MainExpedientesPrincipales;