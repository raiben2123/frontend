import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalEmpresas from './ModalEmpresas';
import ModalGenerico from './ModalGenerico';
import { useMutation } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

const MainEmpresas = ({ className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [columns, setColumns] = useState([
        { id: 'cif', label: 'CIF' },
        { id: 'name', label: 'Nombre' },
        { id: 'address', label: 'Dirección' },
        { id: 'tlf', label: 'Teléfono' },
        { id: 'email', label: 'Email' },
        { id: 'representante', label: 'Representante' },
        { id: 'actions', label: 'Acciones' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [empresaToDelete, setEmpresaToDelete] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [empresaToDeleteId, setEmpresaToDeleteId] = useState(null);
    const [peticionarios, setPeticionarios] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const savedEmpresas = localStorage.getItem('empresas');
        const savedPeticionarios = localStorage.getItem('peticionarios');

        if (savedEmpresas) {
            setEmpresas(JSON.parse(savedEmpresas));
        } else {
            fetchEmpresas();
        }

        if (savedPeticionarios) {
            setPeticionarios(JSON.parse(savedPeticionarios));
        } else {
            fetchPeticionarios();
        }
    }, []);

    // Función para obtener datos de empresas
    const fetchEmpresas = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/empresas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setEmpresas(data);
            localStorage.setItem('empresas', JSON.stringify(data));
        } catch (error) {
            toast.error('Error al cargar las empresas', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    // Función para obtener datos de peticionarios
    const fetchPeticionarios = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/peticionarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setPeticionarios(data);
            localStorage.setItem('peticionarios', JSON.stringify(data));
        } catch (error) {
            toast.error('Error al cargar los peticionarios', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const mutationEmpresa = useMutation({
        mutationFn: (empresaData) => {
            let url, method;
            if (empresaData.id) {
                url = `http://localhost:9000/api/empresas/${empresaData.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:9000/api/empresas';
                method = 'POST';
            }

            return fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(empresaData),
            });
        },
        onSuccess: (response) => {
            response.json().then(data => {
                const storedEmpresas = JSON.parse(localStorage.getItem('empresas')) || [];
                let updatedEmpresas;

                if (data.id) {
                    updatedEmpresas = storedEmpresas.map(e => e.id === data.id ? data : e);
                } else {
                    updatedEmpresas = [...storedEmpresas, data];
                }

                setEmpresas(updatedEmpresas);
                localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));

                toast.success('Empresa guardada correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsModalOpen(false);
                setSelectedEmpresa(null);
            });
        },
        onError: (error) => {
            toast.error('Error al guardar la empresa: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationDeleteEmpresa = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:9000/api/empresas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        onSuccess: () => {
            if (empresaToDeleteId) {
                setEmpresas(prevEmpresas => {
                    const updatedEmpresas = prevEmpresas.filter(empresa =>
                        empresa.id.toString() !== empresaToDeleteId.toString()
                    );
                    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
                    return updatedEmpresas;
                });
                toast.success('Empresa eliminada correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsModalConfirmacionOpen(false);
                setEmpresaToDeleteId(null);
            }
        },
        onError: (error) => {
            toast.error('Error al eliminar la empresa: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const filteredEmpresas = empresas.filter(empresa =>
        Object.keys(empresa).some(key =>
            String(empresa[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const currentItems = filteredEmpresas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setColumns((columns) => {
                const oldIndex = columns.findIndex((c) => c.id === active.id);
                const newIndex = columns.findIndex((c) => c.id === over.id);
                return arrayMove(columns, oldIndex, newIndex);
            });
        }
    };

    return (
        <div id="MainEmpresas" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <Toaster />
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">EMPRESAS</h2>
                    <div id="filtroContainer" className="flex items-center">
                        <input
                            type="text"
                            id="filtro"
                            className="border rounded p-2 w-64 transition-all duration-300"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" className="ml-2 w-6 h-6 cursor-pointer" />
                    </div>
                </div>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={columns.filter(column => column.id !== 'actions').map(column => column.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div id="TablaEmpresas">
                        <div id="CuerpoTabla">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {columns.map((column) => {
                                            if (column.id === 'actions') {
                                                return <th key={column.id} className="border px-4 py-2 text-left">{column.label}</th>;
                                            }

                                            let width;
                                            switch (column.id) {
                                                case 'cif':
                                                    width = '5%'; // Por ejemplo, ancho más pequeño para CIF
                                                    break;
                                                case 'name':
                                                    width = '20%'; // Ancho más grande para el nombre
                                                    break;
                                                case 'address':
                                                    width = '25%'; // Ancho más grande para la dirección
                                                    break;
                                                default:
                                                    width = 'auto'; // Deja que otros campos se ajusten automáticamente
                                            }

                                            return (
                                                <SortableItem key={column.id} id={column.id} width={width}>
                                                    <span className="inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                                        {column.label}
                                                    </span>
                                                </SortableItem>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((empresa) => (
                                        <tr key={empresa.id} className="border-b hover:bg-gray-50">
                                            {columns.map((column) => (
                                                <td key={column.id} className="border px-4 py-2">
                                                    {column.id === 'actions' ? (
                                                        <>
                                                            <button onClick={() => { setSelectedEmpresa(empresa); setIsModalOpen(true); }} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Modificar</button>
                                                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2" onClick={() => { setEmpresaToDelete(empresa); setIsModalConfirmacionOpen(true); }}>Eliminar</button>
                                                        </>
                                                    ) : column.id === 'representante' ? (
                                                        empresa.representanteId ?
                                                            (peticionarios.find(p => p.id === empresa.representanteId)?.name + " " + peticionarios.find(p => p.id === empresa.representanteId)?.surname) || '' : ''
                                                    ) : (
                                                        empresa[column.id]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div id="PaginacionEmpresas" className="flex justify-between items-center mt-4">
                                <span>Página {currentPage} de {totalPages}</span>
                                <div id="Botones" className="flex">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className={`bg-gray-300 px-3 py-1 rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className={`bg-gray-300 px-3 py-1 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            <div className="mt-4 flex justify-end">
                <button onClick={() => { setSelectedEmpresa(null); setIsModalOpen(true); }} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Añadir Nueva Empresa
                </button>
            </div>

            <ModalEmpresas
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddOrUpdate={(empresa) => mutationEmpresa.mutate(empresa)}
                empresa={selectedEmpresa}
            />

            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={() => {
                    if (empresaToDelete) {
                        setEmpresaToDeleteId(empresaToDelete.id);
                        mutationDeleteEmpresa.mutate(empresaToDelete.id);
                        setEmpresaToDelete(null);
                    }
                }}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar esta empresa?"
            />
        </div>
    );
};

export default MainEmpresas;