import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import ModalClasificaciones from './ModalClasificaciones';
import ModalGenerico from './ModalGenerico';
import { useMutation } from '@tanstack/react-query';
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
    const [clasificaciones, setClasificaciones] = useState([]);
    const [clasificacionToDeleteId, setClasificacionToDeleteId] = useState(null);

    const token = localStorage.getItem('token');

    // Cargar clasificaciones desde localStorage cuando se monta el componente
    useEffect(() => {
        const savedClasificaciones = localStorage.getItem('clasificaciones');
        if (savedClasificaciones) {
            setClasificaciones(JSON.parse(savedClasificaciones));
        } else {
            fetchClasificaciones(); // Llamar a fetch si no hay datos en el localStorage
        }
    }, []);

    // Función para hacer el GET y almacenar en localStorage
    const fetchClasificaciones = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/clasificaciones', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setClasificaciones(data);
            localStorage.setItem('clasificaciones', JSON.stringify(data)); // Guardar los datos en localStorage
        } catch (error) {
            toast.error('Error al cargar las clasificaciones', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const mutationAdd = useMutation({
        mutationFn: (newClasificacion) =>
            fetch('http://localhost:9000/api/clasificaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newClasificacion),
            }),
        onSuccess: (response) => {
            response.json().then(data => {
                // Asumiendo que el backend devuelve el objeto con el id ya asignado
                const storedClasificaciones = JSON.parse(localStorage.getItem('clasificaciones')) || [];

                // Actualizamos las clasificaciones locales con el nuevo objeto que incluye el id
                const updatedClasificaciones = [...storedClasificaciones, data]; // 'data' debería contener la clasificación con 'id'
                setClasificaciones(updatedClasificaciones);
                // Aquí se actualiza el estado de clasificaciones
                // Si usas useState o Context, deberías actualizarlo
                localStorage.setItem('clasificaciones', JSON.stringify(updatedClasificaciones));

                toast.success('Clasificación añadida correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
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
        mutationFn: async (updatedClasificacion) => {
            await fetch(`http://localhost:9000/api/clasificaciones/${updatedClasificacion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedClasificacion),
            });
            const updatedClasificaciones = clasificaciones.map((clasificacion) =>
                clasificacion.id === updatedClasificacion.id ? updatedClasificacion : clasificacion
            );
            setClasificaciones(updatedClasificaciones);
            localStorage.setItem('clasificaciones', JSON.stringify(updatedClasificaciones)); // Actualizar localStorage
        },
        onSuccess: () => {
            toast.success('Clasificación actualizada correctamente', {
                style: { background: '#4CAF50', color: 'white', fontWeight: 'bold' },
            });
        },
        onError: (error) => {
            toast.error('Error al actualizar la clasificación: ' + error.message, {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        },
    });

    const mutationDelete = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:9000/api/clasificaciones/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            if (clasificacionToDeleteId) { // Ahora usamos el nuevo estado
                setClasificaciones(prevClasificaciones => {
                    const updatedClasificaciones = prevClasificaciones.filter(clasificacion => 
                        clasificacion.id.toString() !== clasificacionToDeleteId.toString()
                    );
            
                    localStorage.setItem('clasificaciones', JSON.stringify(updatedClasificaciones));
                    return updatedClasificaciones;
                });
                toast.success('Clasificación eliminada correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setClasificacionToDeleteId(null); // Reseteamos el estado después de la operación exitosa
            }
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
        setSelectedClasificacion(clasificacion);
        setIsModalOpen(true);
    };

    const handleUpdate = (updatedClasificacion) => {
        mutationUpdate.mutate(updatedClasificacion);
        setIsModalOpen(false);
        setSelectedClasificacion(null);
    };

    const handleDelete = () => {
    
        if (clasificacionToDelete) {
            setClasificacionToDeleteId(clasificacionToDelete.id); // Guardamos el id antes de mutar
            mutationDelete.mutate(clasificacionToDelete.id); 
            setClasificacionToDelete(null); // Ahora sí puedes setearlo a null
            setIsModalConfirmacionOpen(false);
        } else {
            console.log("No se ha seleccionado ninguna clasificación para eliminar.");
        }
    };


    const openDeleteModal = (clasificacion) => {
        console.log("Abriendo modal para eliminar:", clasificacion); // Esto nos ayudará a verificar si el objeto está siendo pasado correctamente
        setClasificacionToDelete(clasificacion);  // Aquí se debe pasar el objeto completo
        setIsModalConfirmacionOpen(true);
    };



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredClasificaciones = clasificaciones.filter(clasificacion => {
        return clasificacion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clasificacion.acronym.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const currentItems = filteredClasificaciones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClasificaciones.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id="MainClasificaciones" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <Toaster />
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">CLASIFICACIONES</h2>
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
                            <th className="border px-4 py-2">Siglas</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((clasificacion) => (
                            <tr key={clasificacion.id} className="border-b hover:bg-gray-50">
                                <td className="border px-4 py-2">{clasificacion.name}</td>
                                <td className="border px-4 py-2">{clasificacion.acronym}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(clasificacion)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Modificar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2" onClick={() => openDeleteModal(clasificacion)}>Eliminar</button>
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
                        Añadir Clasificación
                    </button>
                </div>
            </div>

            {/* Modales */}
            <ModalClasificaciones
                isOpen={isModalOpen}
                onClose={() => (setIsModalOpen(false), setSelectedClasificacion(null))}
                clasificacion={selectedClasificacion}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={handleDelete}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar esta clasificación?"
            />
        </div>
    );
};

export default MainClasificaciones;
