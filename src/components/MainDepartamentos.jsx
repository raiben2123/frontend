import React, { useState, useEffect } from "react";
import '../css/MainEstadosExpedientes.css';
import busqueda from '../img/busqueda.png';
import ModalDepartamentos from './ModalDepartamentos';
import ModalGenerico from './ModalGenerico'; // Importar el modal genérico

const MainDepartamentos = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [departamentoToDelete, setDepartamentoToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const fetchDepartamentos = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/departamentos');
            if (!response.ok) {
                throw new Error('Error al obtener los departamentos');
            }
            const data = await response.json();
            setDepartamentos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async (newDepartamento) => {
        try {
            const response = await fetch('http://localhost:8081/api/departamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDepartamento),
            });
            if (!response.ok) {
                throw new Error('Error al añadir el departamento');
            }
            fetchDepartamentos();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (departamento) => {
        setSelectedDepartamento(departamento);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedDepartamento) => {
        try {
            const response = await fetch(`http://localhost:8081/api/departamentos/${updatedDepartamento.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDepartamento),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el departamento');
            }
            fetchDepartamentos();
            setIsModalOpen(false);
            setSelectedDepartamento(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (departamentoToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/departamentos/${departamentoToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar el departamento');
                }
                fetchDepartamentos();
                setDepartamentoToDelete(null);
                setIsModalConfirmacionOpen(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openDeleteModal = (id) => {
        setDepartamentoToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredDepartamentos = departamentos.filter(departamento =>
        departamento.name && departamento.name.toLowerCase().includes(searchTerm.toLowerCase())
    );    
    const currentItems = filteredDepartamentos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDepartamentos.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainDepartamentos" className={className}>
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
                            setSelectedDepartamento(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainDepartamentos;
