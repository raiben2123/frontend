import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import ModalEstadosExpedientes from './ModalEstadosExpedientes';
import ModalGenerico from './ModalGenerico';
import { useMutation } from '@tanstack/react-query';
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
    const [estadosExpedientes, setEstadosExpedientes] = useState([]);
    const [estadoToDeleteId, setEstadoToDeleteId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const savedEstados = localStorage.getItem('estadosExpedientes');
        if (savedEstados) {
            setEstadosExpedientes(JSON.parse(savedEstados));
        } else {
            fetchEstadosExpedientes();
        }
    }, []);

    const fetchEstadosExpedientes = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/estadosexpedientes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setEstadosExpedientes(data);
            localStorage.setItem('estadosExpedientes', JSON.stringify(data));
        } catch (error) {
            toast.error('Error al cargar los estados de expedientes', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const mutationAdd = useMutation({
        mutationFn: (newEstado) =>
            fetch('http://localhost:9000/api/estadosexpedientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newEstado),
            }),
        onSuccess: (response) => {
            response.json().then(data => {
                setEstadosExpedientes(prevEstados => {
                    const updatedEstados = [...prevEstados, data];
                    localStorage.setItem('estadosExpedientes', JSON.stringify(updatedEstados));
                    return updatedEstados;
                });
                toast.success('Estado de expediente añadido correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
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
            fetch(`http://localhost:9000/api/estadosexpedientes/${updatedEstado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedEstado),
            }),
        onSuccess: (response) => {
            response.json().then(data => {
                setEstadosExpedientes(prevEstados => {
                    const updatedEstados = prevEstados.map(estado => estado.id === data.id ? data : estado);
                    localStorage.setItem('estadosExpedientes', JSON.stringify(updatedEstados));
                    return updatedEstados;
                });
                toast.success('Estado de expediente actualizado correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
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
            fetch(`http://localhost:9000/api/estadosexpedientes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            if (estadoToDeleteId) {
                setEstadosExpedientes(prevEstados => {
                    const updatedEstados = prevEstados.filter(estado => estado.id.toString() !== estadoToDeleteId.toString());
                    localStorage.setItem('estadosExpedientes', JSON.stringify(updatedEstados));
                    return updatedEstados;
                });
                toast.success('Estado de expediente eliminado correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsModalConfirmacionOpen(false);
                setEstadoToDeleteId(null);
            }
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

    const handleEdit = (estado) => {
        setSelectedEstadosExpedientes(estado);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedEstado) => {
        mutationUpdate.mutate(updatedEstado);
        setIsModalOpen(false);
        setSelectedEstadosExpedientes(null);
    };

    const handleDelete = () => {
        if (estadoToDelete) {
            setEstadoToDeleteId(estadoToDelete.id);
            mutationDelete.mutate(estadoToDelete.id);
            setEstadoToDelete(null);
        }
    };

    const openDeleteModal = (estado) => {
        setEstadoToDelete(estado);
        setIsModalConfirmacionOpen(true);
    };

    const filteredEstadosExpedientes = estadosExpedientes.filter(estado =>
        estado.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEstadosExpedientes.length / itemsPerPage);
    const currentItems = filteredEstadosExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainEstadosExpedientes" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <Toaster />
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">ESTADOS DE EXPEDIENTES</h2>
                    <div id="filtroContainer" className="flex items-center">
                        <input
                            type="text"
                            id="filtro"
                            className={`border rounded p-2 ${filtroExpanded ? 'w-64' : 'w-32'} transition-all duration-300`}
                            onFocus={toggleFiltro}
                            onBlur={toggleFiltro}
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" className="ml-2 w-6 h-6 cursor-pointer" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((estado) => (
                            <tr key={estado.id} className="border-b hover:bg-gray-50">
                                <td className="border px-4 py-2">{estado.name}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(estado)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Modificar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2" onClick={() => openDeleteModal(estado)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div id="Paginacion" className="flex justify-between items-center mt-4">
                    <span>Página {currentPage} de {totalPages}</span>
                    <div id="Botones" className="flex">
                        <button
                            className={`bg-gray-300 px-3 py-1 rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
                        <button
                            className={`bg-gray-300 px-3 py-1 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Añadir Estado
                    </button>
                </div>
            </div>

            {/* Modales */}
            <ModalEstadosExpedientes
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEstadosExpedientes(null);
                }}
                estadosExpedientes={selectedEstadosExpedientes}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={handleDelete}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar este estado de expediente?"
            />
        </div>
    );
};

export default MainEstadosExpedientes;