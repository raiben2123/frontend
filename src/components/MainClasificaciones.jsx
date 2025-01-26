import React, { useState } from "react";
import '../css/MainClasificaciones.css';
import busqueda from '../img/busqueda.png';
import ModalClasificaciones from './ModalClasificaciones';
import ModalGenerico from './ModalGenerico';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClasificaciones } from '../api/apiService'; // Asegúrate de que la ruta es correcta
import { Toaster, toast } from 'sonner';

const MainClasificaciones = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedClasificacion, setSelectedClasificacion] = useState(null);
    const [clasificacionToDelete, setClasificacionToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient();

    const { data: clasificaciones, isLoading, isError, error } = useQuery({
        queryKey: ['clasificaciones'],
        queryFn: fetchClasificaciones
    });

    const mutationAdd = useMutation({
        mutationFn: (newClasificacion) =>
            fetch('http://143.131.204.234:9000/api/clasificaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClasificacion),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clasificaciones'] });
            toast.success('Clasificación añadida correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al añadir la clasificación: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationUpdate = useMutation({
        mutationFn: (updatedClasificacion) =>
            fetch(`http://143.131.204.234:9000/api/clasificaciones/${updatedClasificacion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClasificacion),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clasificaciones'] });
            toast.success('Clasificación actualizada correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al actualizar la clasificación: ' + error.message, {
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
            fetch(`http://143.131.204.234:9000/api/clasificaciones/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clasificaciones'] });
            toast.success('Clasificación eliminada correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al eliminar la clasificación: ' + error.message, {
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

    const handleAdd = (newClasificacion) => {
        mutationAdd.mutate(newClasificacion);
        setIsModalOpen(false);
    };

    const handleEdit = (clasificacion) => {
        // Aseguramos que estamos pasando el objeto completo al modal
        setSelectedClasificacion(clasificacion);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedClasificacion) => {
        // Aseguramos que estamos enviando el objeto correcto para actualizar
        mutationUpdate.mutate(updatedClasificacion);
        setIsModalOpen(false);
        setSelectedClasificacion(null);
    };

    const handleDelete = () => {
        if (clasificacionToDelete) {
            console.log("Deleting classification with ID:", clasificacionToDelete); // Añadir log para depuración
            mutationDelete.mutate(clasificacionToDelete);
            setClasificacionToDelete(null); // Limpiamos inmediatamente para evitar múltiples eliminaciones
            setIsModalConfirmacionOpen(false); // Cerramos el modal de confirmación
        } else {
            console.log("No clasification to delete set."); // Log si no hay ID para eliminar
        }
    };

    const openDeleteModal = (id) => {
        setClasificacionToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    if (isLoading) return <div>Cargando clasificaciones...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredClasificaciones = Array.isArray(clasificaciones) ? clasificaciones.filter(clasificacion => {
        if (clasificacion && typeof clasificacion.name === 'string' && typeof clasificacion.acronym === 'string') {
            return clasificacion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clasificacion.acronym.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false; // Si no tiene name y acronym como strings, no lo incluimos en el filtro
    }) : [];

    const currentItems = filteredClasificaciones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClasificaciones.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainClasificaciones" className={className}>
            <Toaster />
            <div id="Encabezado">
                <div id="EncabezadoTabla">
                    <h2>CLASIFICACIONES</h2>
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
                            <th>Siglas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((clasificacion) => (
                            <tr key={clasificacion.id}>
                                <td>{clasificacion.name}</td>
                                <td>{clasificacion.acronym}</td>
                                <td>
                                    <button onClick={() => handleEdit(clasificacion)}>Modificar</button>
                                    <button className="btn-delete" onClick={() => openDeleteModal(clasificacion.id)}>Eliminar</button>
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
                    <button onClick={() => { setIsModalOpen(true); setSelectedClasificacion(null); }}>Añadir Nuevo</button>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['clasificaciones'] })}>Refrescar Datos</button>
                    <ModalClasificaciones
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setSelectedClasificacion(null) }}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        clasificacion={selectedClasificacion}
                    />
                    <ModalGenerico
                        isOpen={isModalConfirmacionOpen}
                        title="Confirmar Eliminación"
                        message="¿Estás seguro de que deseas eliminar esta clasificación?"
                        onClose={() => {
                            setIsModalConfirmacionOpen(false);
                            setClasificacionToDelete(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainClasificaciones;