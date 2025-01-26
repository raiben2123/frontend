import React, { useState } from "react";
import '../css/MainEstadosExpedientes.css';
import busqueda from '../img/busqueda.png';
import ModalDepartamentos from './ModalDepartamentos';
import ModalGenerico from './ModalGenerico';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDepartamentos } from '../api/apiService'; // Asegúrate de que la ruta es correcta
import { Toaster, toast } from 'sonner';

const MainDepartamentos = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [departamentoToDelete, setDepartamentoToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient();

    const { data: departamentos, isLoading, isError, error } = useQuery({
        queryKey: ['departamentos'],
        queryFn: fetchDepartamentos
    });

    const mutationAdd = useMutation({
        mutationFn: (newDepartamento) => 
            fetch('http://143.131.204.234:9000/api/departamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDepartamento),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departamentos'] });
            toast.success('Departamento añadido correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al añadir el departamento: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationUpdate = useMutation({
        mutationFn: (updatedDepartamento) => 
            fetch(`http://143.131.204.234:9000/api/departamentos/${updatedDepartamento.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDepartamento),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departamentos'] });
            toast.success('Departamento actualizado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al actualizar el departamento: ' + error.message, {
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
            fetch(`http://143.131.204.234:9000/api/departamentos/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departamentos'] });
            toast.success('Departamento eliminado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
        onError: (error) => {
            toast.error('Error al eliminar el departamento: ' + error.message, {
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

    const handleAdd = (newDepartamento) => {
        mutationAdd.mutate(newDepartamento);
        setIsModalOpen(false);
    };

    const handleEdit = (departamento) => {
        setSelectedDepartamento(departamento);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedDepartamento) => {
        mutationUpdate.mutate(updatedDepartamento);
        setIsModalOpen(false);
        setSelectedDepartamento(null);
    };

    const handleDelete = () => {
        if (departamentoToDelete) {
            mutationDelete.mutate(departamentoToDelete);
            setDepartamentoToDelete(null);
            setIsModalConfirmacionOpen(false);
        }
    };

    const openDeleteModal = (id) => {
        setDepartamentoToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    if (isLoading) return <div>Cargando departamentos...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredDepartamentos = Array.isArray(departamentos) ? departamentos.filter(departamento =>
        departamento.name && departamento.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const currentItems = filteredDepartamentos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDepartamentos.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainDepartamentos" className={className}>
            <Toaster />
            <div id="Encabezado">
                <div id="EncabezadoTabla">
                    <h2>DEPARTAMENTOS</h2>
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
                        {currentItems.map((departamento) => (
                            <tr key={departamento.id}>
                                <td>{departamento.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(departamento)}>Modificar</button>
                                    <button className="btn-delete" onClick={() => openDeleteModal(departamento.id)}>Eliminar</button>
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
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['departamentos'] })}>Refrescar Datos</button>
                    <ModalDepartamentos 
                        isOpen={isModalOpen} 
                        onClose={() => {setIsModalOpen(false); setSelectedDepartamento(null);}} 
                        onAdd={handleAdd} 
                        onUpdate={handleUpdate} 
                        departamento={selectedDepartamento}
                    />
                    <ModalGenerico 
                        isOpen={isModalConfirmacionOpen} 
                        title="Confirmar Eliminación" 
                        message="¿Estás seguro de que deseas eliminar este departamento?" 
                        onClose={() => {
                            setIsModalConfirmacionOpen(false); 
                            setDepartamentoToDelete(null);
                        }} 
                        onConfirm={handleDelete} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MainDepartamentos;