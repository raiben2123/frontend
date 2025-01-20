import React, { useState } from "react";
import '../css/MainEstadosExpedientes.css';
import busqueda from '../img/busqueda.png';
import ModalEstadosExpedientes from './ModalEstadosExpedientes';
import ModalGenerico from './ModalGenerico';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEstadosExpedientes } from '../api/apiService'; // Asegúrate de que la ruta es correcta
import { Toaster, toast } from 'sonner';

const MainEstadosExpedientes = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedEstadosExpedientes, setSelectedEstadosExpedientes] = useState(null);
    const [estadoToDelete, setEstadoToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: estadosExpedientes, isLoading, isError, error } = useQuery({
        queryKey: ['estadosExpedientes'],
        queryFn: fetchEstadosExpedientes
    });

    const mutationAdd = useMutation({
        mutationFn: (newEstado) =>
            fetch('http://localhost:8081/api/estadosexpedientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEstado),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estadosExpedientes'] });
            toast.success('Estado de expediente añadido correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al añadir el estado de expediente: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationUpdate = useMutation({
        mutationFn: (updatedEstado) =>
            fetch(`http://localhost:8081/api/estadosexpedientes/${updatedEstado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEstado),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estadosExpedientes'] });
            toast.success('Estado de expediente actualizado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al actualizar el estado de expediente: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationDelete = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:8081/api/estadosexpedientes/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estadosExpedientes'] });
            toast.success('Estado de expediente eliminado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al eliminar el estado de expediente: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const handleAdd = (newEstado) => {
        mutationAdd.mutate(newEstado);
        setIsModalOpen(false);
    };

    const handleEdit = (estadosExpedientes) => {
        setSelectedEstadosExpedientes(estadosExpedientes);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedEstado) => {
        mutationUpdate.mutate(updatedEstado);
        setIsModalOpen(false);
        setSelectedEstadosExpedientes(null);
    };

    const handleDelete = () => {
        if (estadoToDelete) {
            mutationDelete.mutate(estadoToDelete);
            setEstadoToDelete(null);
            setIsModalConfirmacionOpen(false);
        }
    };

    const openDeleteModal = (id) => {
        setEstadoToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    if (isLoading) return <div>Cargando estados de expedientes...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredEstadosExpedientes = Array.isArray(estadosExpedientes) ? estadosExpedientes.filter(estado =>
        estado.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const currentItems = filteredEstadosExpedientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEstadosExpedientes.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainEstadosExpedientes" className={className}>
            <Toaster />
            <div id="Encabezado">
                <div id="EncabezadoTabla">
                    <h2>ESTADOS DE EXPEDIENTES</h2>
                    <div id="filtroContainer">
                        <input
                            type="text"
                            id="filtro"
                            className={filtroExpanded ? 'expanded' : ''}
                            onFocus={toggleFiltro}
                            onBlur={toggleFiltro}
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((estado) => (
                            <tr key={estado.id}>
                                <td>{estado.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(estado)}>Modificar</button>
                                    <button className="btn-delete" onClick={() => openDeleteModal(estado.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div id="Paginacion">
                    <span>Página {currentPage} de {totalPages}</span>
                    <div id="Botones">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
                    </div>
                </div>
                <div id="Botones">
                    <button onClick={() => setIsModalOpen(true)}>Añadir Nuevo</button>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['estadosExpedientes'] })}>Refrescar Datos</button>
                    <ModalEstadosExpedientes
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setSelectedEstadosExpedientes(null); }}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        estadosExpedientes={selectedEstadosExpedientes}
                    />
                    <ModalGenerico
                        isOpen={isModalConfirmacionOpen}
                        title="Confirmar Eliminación"
                        message="¿Estás seguro de que deseas eliminar este estado?"
                        onClose={() => { setIsModalConfirmacionOpen(false); setEstadoToDelete(null); }}
                        onConfirm={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainEstadosExpedientes;