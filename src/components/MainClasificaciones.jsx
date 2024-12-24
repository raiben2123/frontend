import React, { useState, useEffect } from "react";
import '../css/MainClasificaciones.css';
import busqueda from '../img/busqueda.png';
import ModalClasificaciones from './ModalClasificaciones';
import ModalGenerico from './ModalGenerico'; // Importar el modal genérico

const MainClasificaciones = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [clasificaciones, setClasificaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedClasificacion, setSelectedClasificacion] = useState(null);
    const [clasificacionToDelete, setClasificacionToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const fetchClasificaciones = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/clasificaciones');
            if (!response.ok) {
                throw new Error('Error al obtener las clasificaciones');
            }
            const data = await response.json();
            setClasificaciones(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (newClasificacion) => {
        try {
            const response = await fetch('http://localhost:8081/api/clasificaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClasificacion),
            });
            if (!response.ok) {
                throw new Error('Error al añadir la clasificación');
            }
            fetchClasificaciones();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (clasificacion) => {
        setSelectedClasificacion(clasificacion);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedClasificacion) => {
        try {
            const response = await fetch(`http://localhost:8081/api/clasificaciones/${updatedClasificacion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClasificacion),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la clasificación');
            }
            fetchClasificaciones();
            setIsModalOpen(false);
            setSelectedClasificacion(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (clasificacionToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/clasificaciones/${clasificacionToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar la clasificación');
                }
                fetchClasificaciones();
                setClasificacionToDelete(null);
                setIsModalConfirmacionOpen(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openDeleteModal = (id) => {
        setClasificacionToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    useEffect(() => {
        fetchClasificaciones();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredClasificaciones = clasificaciones.filter(clasificacion =>
        clasificacion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clasificacion.acronym.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentItems = filteredClasificaciones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClasificaciones.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainClasificaciones" className={className}>
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
                    <button onClick={() => setIsModalOpen(true)}>Añadir Nuevo</button>
                    <ModalClasificaciones 
                        isOpen={isModalOpen} 
                        onClose={() => {setIsModalOpen(false); setClasificacionToDelete(null)}} 
                        onAdd={handleAdd} 
                        onUpdate={handleUpdate} 
                        clasificacion={selectedClasificacion} 
                    />
                    <ModalGenerico 
                        isOpen={isModalConfirmacionOpen} 
                        title="Confirmar Eliminación" 
                        message="¿Estás seguro de que deseas eliminar esta clasificación?" 
                        onClose={() => {setIsModalConfirmacionOpen(false); setClasificacionToDelete(null)}} 
                        onConfirm={handleDelete} 
                    />
                </div>
            </div>
        </div>
    );
};

export default MainClasificaciones;