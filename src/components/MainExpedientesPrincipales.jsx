import React, { useState } from "react";
import '../css/MainExpedientesPrincipales.css';
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalExpediente from './ModalExpediente';
import ModalGenerico from './ModalGenerico';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpedientesPrincipales, fetchEstadosExpedientes, fetchDepartamentos, fetchClasificaciones, fetchPeticionarios, fetchEmpresas } from '../api/apiService';
import { toast } from "sonner";

const MainExpedientesPrincipales = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [columns, setColumns] = useState([
        { id: 'solicitud', label: 'Solicitud' },
        { id: 'registro', label: 'Registro' },
        { id: 'fechaRegistro', label: 'Fecha de registro' },
        { id: 'expediente', label: 'Expediente' },
        { id: 'peticionario', label: 'Peticionario/Empresa' },
        { id: 'referenciaCatastral', label: 'Referencia Catastral' },
        { id: 'estadoExp', label: 'Estado Exp' },
        { id: 'departamento', label: 'Departamento' },
        { id: 'clasificacion', label: 'Clasificación' },
        { id: 'acciones', label: 'Acciones' }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [expedienteToDelete, setExpedienteToDelete] = useState(null);
    const [expedienteToModify, setExpedienteToModify] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient();

    // Fetching data with useQuery
    const { data: expedientes, isLoading: loadingExpedientes, isError: errorExpedientes } = useQuery({
        queryKey: ['expedientes'],
        queryFn: fetchExpedientesPrincipales
    });

    const { data: estadosExpedientes, isLoading: loadingEstadosExpedientes, isError: errorEstadosExpedientes } = useQuery({
        queryKey: ['estadosExpedientes'],
        queryFn: fetchEstadosExpedientes
    });

    const { data: departamentos, isLoading: loadingDepartamentos, isError: errorDepartamentos } = useQuery({
        queryKey: ['departamentos'],
        queryFn: fetchDepartamentos
    });

    const { data: clasificaciones, isLoading: loadingClasificaciones, isError: errorClasificaciones } = useQuery({
        queryKey: ['clasificaciones'],
        queryFn: fetchClasificaciones
    });

    const { data: peticionarios, isLoading: loadingPeticionarios, isError: errorPeticionarios } = useQuery({
        queryKey: ['peticionarios'],
        queryFn: fetchPeticionarios
    });

    const { data: empresas, isLoading: loadingEmpresas, isError: errorEmpresas } = useQuery({
        queryKey: ['empresas'],
        queryFn: fetchEmpresas
    });

    // Mutation for saving/updating an expediente
    const mutationSaveExpediente = useMutation({
        mutationFn: async (data) => {
            console.log('Data to save:', data);
            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `http://localhost:8081/api/expedientesprincipales/${data.id}` : 'http://localhost:8081/api/expedientesprincipales';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expedientes'] });
            setIsModalOpen(false);
            setExpedienteToModify({});
        },
        onError: (error) => {
            console.error('Error al guardar o actualizar el expediente:', error.message);
        }
    });

    // Mutation for deleting an expediente
    const mutationDeleteExpediente = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:8081/api/expedientesprincipales/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expedientes'] });
            toast.success('Expediente eliminado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsModalConfirmacionOpen(false);
            setExpedienteToDelete(null);
        },
        onError: (error) => {
            console.error('Error al eliminar el expediente:', error.message);
        }
    });

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
        setExpedienteToModify({});
    };

    const handleModify = (expediente) => {
        const peticionario = peticionarios?.find(p => p.id === expediente.peticionarioId) || { name: 'N/A' };
        const empresa = empresas?.find(e => e.id === expediente.empresaId) || { name: 'N/A' };
        const estadoExp = estadosExpedientes?.find(e => e.id === expediente.estadoId) || { name: 'N/A' };
        const departamento = departamentos?.find(d => d.id === expediente.departamentoId) || { name: 'N/A' };
        const clasificacion = clasificaciones?.find(c => c.id === expediente.clasificacionId) || { name: 'N/A' };

        setExpedienteToModify({
            ...expediente,
            peticionario: {
                value: expediente.peticionarioId,
                name: peticionario.name
            },
            empresa: {
                value: expediente.empresaId,
                name: empresa.name
            },
            estadoExpedienteId: expediente.estadoId,
            departamentoId: expediente.departamentoId,
            clasificacionId: expediente.clasificacionId,
        });
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        mutationSaveExpediente.mutate(data);
    };

    const handleDeleteConfirm = (id) => {
        setExpedienteToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    const handleDelete = () => {
        if (expedienteToDelete) {
            mutationDeleteExpediente.mutate(expedienteToDelete);
        }
    };

    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Helper function to search in nested objects
    const searchInNestedObject = (obj, searchTerm) => {
        if (!obj) return false;
        if (typeof obj === 'string' || typeof obj === 'number') {
            return obj.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (searchInNestedObject(obj[key], searchTerm)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Error handling for loading states
    if (loadingExpedientes || loadingEstadosExpedientes || loadingDepartamentos || loadingClasificaciones || loadingPeticionarios || loadingEmpresas) {
        return <div>Cargando...</div>;
    }

    if (errorExpedientes || errorEstadosExpedientes || errorDepartamentos || errorClasificaciones || errorPeticionarios || errorEmpresas) {
        return <div>Error al cargar datos</div>;
    }

    // Filter expedientes based on search term
    const filteredExpedientes = (expedientes || []).filter(expediente => {
        const searchTermLower = searchTerm.toLowerCase();
        // Check all direct fields
        if (Object.values(expediente).some(value =>
            value && typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
        )) {
            return true;
        }

        // Check nested fields
        if (expediente.peticionarioId) {
            const peticionario = peticionarios.find(p => p.id === expediente.peticionarioId);
            if (peticionario && (searchInNestedObject(peticionario, searchTermLower) || searchInNestedObject(peticionario.dni, searchTermLower))) {
                return true;
            }
        }

        if (expediente.empresaId) {
            const empresa = empresas.find(e => e.id === expediente.empresaId);
            if (empresa && (searchInNestedObject(empresa, searchTermLower) || searchInNestedObject(empresa.cif, searchTermLower))) {
                return true;
            }
        }

        if (expediente.estadoId) {
            const estado = estadosExpedientes.find(e => e.id === expediente.estadoId);
            if (estado && (searchInNestedObject(estado, searchTermLower) || estado.name.toLowerCase().includes(searchTermLower))) {
                return true;
            }
        }

        // For departamento
        if (expediente.departamentoId) {
            const departamento = departamentos.find(d => d.id === expediente.departamentoId);
            if (departamento && (searchInNestedObject(departamento, searchTermLower) || departamento.name.toLowerCase().includes(searchTermLower))) {
                return true;
            }
        }

        // For clasificacion
        if (expediente.clasificacionId) {
            const clasificacion = clasificaciones.find(c => c.id === expediente.clasificacionId);
            if (clasificacion && (searchInNestedObject(clasificacion, searchTermLower) ||
                clasificacion.name.toLowerCase().includes(searchTermLower) ||
                clasificacion.acronym.toLowerCase().includes(searchTermLower))) {
                return true;
            }
        }

        // Check dates by converting to string for search
        if (expediente.fechaRegistro && new Date(expediente.fechaRegistro).toISOString().includes(searchTerm)) {
            return true;
        }
        if (expediente.fechaInicio && new Date(expediente.fechaInicio).toISOString().includes(searchTerm)) {
            return true;
        }

        // If no match found, return false
        return false;
    });

    const totalPages = Math.ceil(filteredExpedientes.length / itemsPerPage);
    const currentItems = filteredExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPeticionarioOrEmpresaName = (expediente) => {
        if (expediente.peticionarioId) {
            return peticionarios?.find(p => p.id === expediente.peticionarioId)?.name || 'N/A';
        } else if (expediente.empresaId) {
            return empresas?.find(e => e.id === expediente.empresaId)?.name || 'N/A';
        }
        return 'N/A';
    };

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={columns.map(column => column.id)} strategy={horizontalListSortingStrategy}>
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
                                                        getPeticionarioOrEmpresaName(expediente)
                                                        : column.id === 'referenciaCatastral' ?
                                                            <a href={`https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCConCiud.aspx?del=30&mun=1&UrbRus=U&RefC=${expediente[column.id] || ''}&Apenom=&esBice=&RCBice1=&RCBice2=&DenoBice=&from=nuevoVisor&ZV=NO&anyoZV=`} target="_blank" rel="noopener noreferrer">
                                                                {expediente[column.id] || 'N/A'}
                                                            </a>
                                                            : column.id === 'estadoExp' ?
                                                                ((estadosExpedientes && estadosExpedientes.find(e => e.id === expediente.estadoId)?.name) || 'N/A')
                                                                : column.id === 'departamento' ?
                                                                    ((departamentos && departamentos.find(d => d.id === expediente.departamentoId)?.name) || 'N/A')
                                                                    : column.id === 'clasificacion' ?
                                                                        ((clasificaciones && clasificaciones.find(c => c.id === expediente.clasificacionId)?.name) || 'N/A')
                                                                        : column.id === 'acciones' ?
                                                                            <>
                                                                                <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleModify(expediente)}>Modificar</button>
                                                                                <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDeleteConfirm(expediente.id)}>Eliminar</button>
                                                                                <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => console.log('Abrir modal adicional')}>Otras Acciones</button>
                                                                            </>
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
                </div>
            </div>
            <ModalExpediente
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setExpedienteToModify({});
                }}
                onSave={handleSave}
                estados={estadosExpedientes}
                departamentos={departamentos}
                clasificaciones={clasificaciones}
                peticionarios={peticionarios}
                empresas={empresas}
                expediente={expedienteToModify}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este expediente?"
                onClose={() => { setIsModalConfirmacionOpen(false); setExpedienteToDelete(null); }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default MainExpedientesPrincipales;