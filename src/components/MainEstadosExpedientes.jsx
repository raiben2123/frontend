import React, { useState, useEffect } from "react";
import '../css/MainEstadosExpedientes.css';
import busqueda from '../img/busqueda.png';
import ModalEstadosExpedientes from './ModalEstadosExpedientes';
import ModalGenerico from './ModalGenerico'; // Importar el modal genérico

const MainEstadosExpedientes = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [estadosExpedientes, setEstadosExpedientes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedEstadosExpedientes, setSelectedEstadosExpedientes] = useState(null);
    const [estadoToDelete, setEstadoToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const fetchEstadosExpedientes = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/estadosexpedientes');
            if (!response.ok) {
                throw new Error('Error al obtener los estados de expedientes');
            }
            const data = await response.json();
            setEstadosExpedientes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (newEstado) => {
        try {
            const response = await fetch('http://localhost:8081/api/estadosexpedientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEstado),
            });
            if (!response.ok) {
                throw new Error('Error al añadir el estado de expediente');
            }
            fetchEstadosExpedientes();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (estadosExpedientes) => {
        setSelectedEstadosExpedientes(estadosExpedientes);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedEstado) => {
        try {
            const response = await fetch(`http://localhost:8081/api/estadosexpedientes/${updatedEstado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEstado),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el estado de expediente');
            }
            fetchEstadosExpedientes();
            setIsModalOpen(false);
            setSelectedEstadosExpedientes(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (estadoToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/estadosexpedientes/${estadoToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar el estado de expediente');
                }
                fetchEstadosExpedientes();
                setEstadoToDelete(null);
                setIsModalConfirmacionOpen(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openDeleteModal = (id) => {
        setEstadoToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    useEffect(() => {
        fetchEstadosExpedientes();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredEstadosExpedientes = estadosExpedientes.filter(estadosExpedientes =>
        estadosExpedientes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentItems = filteredEstadosExpedientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEstadosExpedientes.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainEstadosExpedientes" className={className}>
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
                            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
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
                        {currentItems.map((estadosExpedientes) => (
                            <tr key={estadosExpedientes.id}>
                                <td>{estadosExpedientes.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(estadosExpedientes)}>Modificar</button>
                                    <button className="btn-delete" onClick={() => openDeleteModal(estadosExpedientes.id)}>Eliminar</button>
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
                    <ModalEstadosExpedientes 
                        isOpen={isModalOpen} 
                        onClose={() => {setIsModalOpen(false); setSelectedEstadosExpedientes(null);}} 
                        onAdd={handleAdd} 
                        onUpdate={handleUpdate} 
                        estadosExpedientes={selectedEstadosExpedientes} 
                    />
                    <ModalGenerico 
                        isOpen={isModalConfirmacionOpen} 
                        title="Confirmar Eliminación" 
                        message="¿Estás seguro de que deseas eliminar este estado?" 
                        onClose={() => {setIsModalConfirmacionOpen(false); setSelectedEstadosExpedientes(null);}} 
                        onConfirm={handleDelete} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MainEstadosExpedientes;
