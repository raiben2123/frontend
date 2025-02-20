import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import ModalDepartamentos from './ModalDepartamentos';
import ModalGenerico from './ModalGenerico';
import { useMutation } from '@tanstack/react-query';
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
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoToDeleteId, setDepartamentoToDeleteId] = useState(null);

    const token = localStorage.getItem('token');

    // Cargar departamentos desde localStorage cuando se monta el componente
    useEffect(() => {
        const savedDepartamentos = localStorage.getItem('departamentos');
        if (savedDepartamentos) {
            setDepartamentos(JSON.parse(savedDepartamentos));
        } else {
            fetchDepartamentos(); // Llamar a fetch si no hay datos en el localStorage
        }
    }, []);

    // Función para hacer el GET y almacenar en localStorage
    const fetchDepartamentos = async () => {
        try {
            const response = await fetch('http://143.131.204.234:9000/api/departamentos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setDepartamentos(data);
            localStorage.setItem('departamentos', JSON.stringify(data)); // Guardar los datos en localStorage
        } catch (error) {
            toast.error('Error al cargar los departamentos', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const mutationAdd = useMutation({
        mutationFn: (newDepartamento) =>
            fetch('http://143.131.204.234:9000/api/departamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDepartamento),
            }),
        onSuccess: (response) => {
            response.json().then(data => {
                const storedDepartamentos = JSON.parse(localStorage.getItem('departamentos')) || [];

                const updatedDepartamentos = [...storedDepartamentos, data];
                setDepartamentos(updatedDepartamentos);
                localStorage.setItem('departamentos', JSON.stringify(updatedDepartamentos));

                toast.success('Departamento añadido correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
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
        mutationFn: async (updatedDepartamento) => {
            await fetch(`http://143.131.204.234:9000/api/departamentos/${updatedDepartamento.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedDepartamento),
            });
            const updatedDepartamentos = departamentos.map((departamento) =>
                departamento.id === updatedDepartamento.id ? updatedDepartamento : departamento
            );
            setDepartamentos(updatedDepartamentos);
            localStorage.setItem('departamentos', JSON.stringify(updatedDepartamentos)); // Actualizar localStorage
        },
        onSuccess: () => {
            toast.success('Departamento actualizado correctamente', {
                style: { background: '#4CAF50', color: 'white', fontWeight: 'bold' },
            });
        },
        onError: (error) => {
            toast.error('Error al actualizar el departamento: ' + error.message, {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        },
    });

    const mutationDelete = useMutation({
        mutationFn: (id) =>
            fetch(`http://143.131.204.234:9000/api/departamentos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            if (departamentoToDeleteId) { 
                setDepartamentos(prevDepartamentos => {
                    const updatedDepartamentos = prevDepartamentos.filter(departamento => 
                        departamento.id.toString() !== departamentoToDeleteId.toString()
                    );
            
                    localStorage.setItem('departamentos', JSON.stringify(updatedDepartamentos));
                    return updatedDepartamentos;
                });
                toast.success('Departamento eliminado correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setDepartamentoToDeleteId(null); 
            }
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
            setDepartamentoToDeleteId(departamentoToDelete.id);
            mutationDelete.mutate(departamentoToDelete.id); 
            setDepartamentoToDelete(null);
            setIsModalConfirmacionOpen(false);
        }
    };

    const openDeleteModal = (departamento) => {
        setDepartamentoToDelete(departamento);
        setIsModalConfirmacionOpen(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredDepartamentos = departamentos.filter(departamento => {
        return departamento.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const currentItems = filteredDepartamentos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDepartamentos.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainDepartamentos" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <Toaster />
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">DEPARTAMENTOS</h2>
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
                        {currentItems.map((departamento) => (
                            <tr key={departamento.id} className="border-b hover:bg-gray-50">
                                <td className="border px-4 py-2">{departamento.name}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(departamento)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Modificar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2" onClick={() => openDeleteModal(departamento)}>Eliminar</button>
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
                        Añadir Departamento
                    </button>
                </div>
            </div>

            {/* Modales */}
            <ModalDepartamentos
                isOpen={isModalOpen}
                onClose={() => (setIsModalOpen(false), setSelectedDepartamento(null))}
                departamento={selectedDepartamento}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={handleDelete}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar este departamento?"
            />
        </div>
    );
};

export default MainDepartamentos;