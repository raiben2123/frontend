import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalPeticionarios from './ModalPeticionarios';
import ModalGenerico from './ModalGenerico';
import ModalEmpresas from './ModalEmpresas';
import { useMutation } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

const MainPeticionarios = ({ className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageDNI, setCurrentPageDNI] = useState(1);
    const [currentPageNIF, setCurrentPageNIF] = useState(1);
    const itemsPerPage = 4;
    const [columnsDNI, setColumnsDNI] = useState([
        { id: 'dni', label: 'DNI', width: '10%' },
        { id: 'name', label: 'Nombre', width: '10%' },
        { id: 'surname', label: 'Apellido', width: '13.5%' },
        { id: 'tlf', label: 'Teléfono', width: '10%' },
        { id: 'email', label: 'Email', width: '20%' },
        { id: 'address', label: 'Dirección', width: '20%' },
        { id: 'representa', label: 'Representa', width: '15%' },
        { id: 'actions', label: 'Acciones', width: '15%' }
    ]);
    const [columnsNIF, setColumnsNIF] = useState([
        { id: 'nif', label: 'NIF', width: '10%' },
        { id: 'name', label: 'Nombre', width: '10%' },
        { id: 'surname', label: 'Apellido', width: '13.5%' },
        { id: 'tlf', label: 'Teléfono', width: '10%' },
        { id: 'email', label: 'Email', width: '20%' },
        { id: 'address', label: 'Dirección', width: '20%' },
        { id: 'representa', label: 'Representa', width: '15%' },
        { id: 'actions', label: 'Acciones', width: '15%' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPeticionario, setCurrentPeticionario] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [peticionarioToDelete, setPeticionarioToDelete] = useState(null);
    const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
    const [currentEmpresa, setCurrentEmpresa] = useState(null);
    const [peticionarios, setPeticionarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [peticionariosResponse, empresasResponse] = await Promise.all([
                    fetch('http://localhost:9000/api/peticionarios', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch('http://localhost:9000/api/empresas', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);

                if (!peticionariosResponse.ok || !empresasResponse.ok) {
                    throw new Error('Error al cargar datos');
                }

                const peticionariosData = await peticionariosResponse.json();
                const empresasData = await empresasResponse.json();

                setPeticionarios(peticionariosData);
                setEmpresas(empresasData);
            } catch (error) {
                toast.error('Error al cargar datos: ' + error.message, {
                    style: {
                        background: '#F44336',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
            }
        };

        fetchData();
    }, [token]);

    const mutationPeticionario = useMutation({
        mutationFn: (peticionarioData) => {
            let url, method;
            if (peticionarioData.id) {
                url = `http://localhost:9000/api/peticionarios/${peticionarioData.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:9000/api/peticionarios';
                method = 'POST';
            }
    
            return fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(peticionarioData),
            });
        },
        onSuccess: (response) => {
            response.json().then(data => {
                let updatedPeticionarios;
                if (data.id) {
                    updatedPeticionarios = peticionarios.map(p => p.id === data.id ? data : p);
                } else {
                    updatedPeticionarios = [...peticionarios, data];
                }
                setPeticionarios(updatedPeticionarios);
                toast.success('Peticionario guardado correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsModalOpen(false);
            });
        },
        onError: (error) => {
            toast.error('Error al guardar el peticionario: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationDeletePeticionario = useMutation({
        mutationFn: (id) => 
            fetch(`http://localhost:9000/api/peticionarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
        onSuccess: () => {
            setPeticionarios(prevPeticionarios => prevPeticionarios.filter(p => p.id !== peticionarioToDelete));
            toast.success('Peticionario eliminado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsDeleteModalOpen(false);
            setPeticionarioToDelete(null);
        },
        onError: (error) => {
            toast.error('Error al eliminar el peticionario: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const mutationAddEmpresa = useMutation({
        mutationFn: (empresaData) => 
            fetch('http://localhost:9000/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(empresaData),
            }),
        onSuccess: (response) => {
            response.json().then(newEmpresa => {
                setEmpresas(prevEmpresas => [...prevEmpresas, newEmpresa]);
                toast.success('Empresa añadida correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsEmpresaModalOpen(false);
                mutationPeticionario.mutate({ ...currentPeticionario, representa: newEmpresa });
            });
        },
        onError: (error) => {
            toast.error('Error al añadir la empresa: ' + error.message, {
                style: {
                    background: '#F44336',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
        },
    });

    const openAddModal = () => {
        setCurrentPeticionario(null);
        setIsModalOpen(true);
    };

    const openEditModal = (peticionario) => {
        let representa = null;
        if (peticionario.representa) {
            const empresa = empresas.find(e => e.id === peticionario.representa);
            representa = empresa ? {
                id: empresa.id,
                name: empresa.name,
                cif: empresa.cif
            } : null;
        }
        setCurrentPeticionario({
            ...peticionario,
            representa: representa
        });
        setIsModalOpen(true);
    };

    const addOrUpdatePeticionario = (peticionarioData) => {
        if (peticionarioData.representa && peticionarioData.representa.id) {
            const empresa = empresas.find(e => e.id === peticionarioData.representa.id);
            if (empresa) {
                peticionarioData.representa = {
                    id: empresa.id
                };
            }
        }
        mutationPeticionario.mutate(peticionarioData);
    };

    const openDeleteModal = (id) => {
        setPeticionarioToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (peticionarioToDelete) {
            mutationDeletePeticionario.mutate(peticionarioToDelete);
        }
    };

    const filteredPeticionariosDNI = peticionarios.filter(p => p.dni && (
        p.dni.includes(searchTerm) ||
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.surname && p.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.tlf && p.tlf.includes(searchTerm)) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.representa && (
            p.representa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.representa.cif.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    ));

    const filteredPeticionariosNIF = peticionarios.filter(p => p.nif && (
        p.nif.includes(searchTerm) ||
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.surname && p.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.tlf && p.tlf.includes(searchTerm)) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.representa && (
            p.representa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.representa.cif.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    ));

    const currentItemsDNI = filteredPeticionariosDNI.slice(
        (currentPageDNI - 1) * itemsPerPage, currentPageDNI * itemsPerPage
    );

    const currentItemsNIF = filteredPeticionariosNIF.slice(
        (currentPageNIF - 1) * itemsPerPage, currentPageNIF * itemsPerPage
    );

    const totalPagesDNI = Math.ceil(filteredPeticionariosDNI.length / itemsPerPage);
    const totalPagesNIF = Math.ceil(filteredPeticionariosNIF.length / itemsPerPage);

    const handleDragEndDNI = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setColumnsDNI((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDragEndNIF = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setColumnsNIF((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const renderTable = (columns, currentItems, currentPage, setCurrentPage, totalPages, handleDragEnd, title) => (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns.filter(column => column.id !== 'actions').map(column => column.id)} strategy={horizontalListSortingStrategy}>
                <div className="mb-4">
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <table className="min-w-full border border-gray-300 table-fixed w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                {columns.map((column) => (
                                    column.id !== 'actions' ? (
                                        <SortableItem key={column.id} id={column.id} width={column.width}>
                                            <span className="inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                                {column.label}
                                            </span>
                                        </SortableItem>
                                    ) : (
                                        <th key={column.id} className="border px-4 py-2 text-left whitespace-nowrap" style={{ width: column.width }}>{column.label}</th>
                                    )
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((peticionario) => (
                                <tr key={peticionario.id} className="border-b hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td key={column.id} className="border px-4 py-2">
                                            {column.id === 'actions' ? (
                                                <>
                                                    <button onClick={() => openEditModal(peticionario)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-1">Modificar</button>
                                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => openDeleteModal(peticionario.id)}>Eliminar</button>
                                                </>
                                            ) : column.id === 'representa' ? (
                                                peticionario.representaId ? 
                                                    (empresas.find(e => e.id === peticionario.representaId)?.name || 'Empresa no encontrada') 
                                                : ''
                                            ) : (
                                                peticionario[column.id]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <span>Página {currentPage} de {totalPages}</span>
                        <div className="flex">
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`bg-gray-300 px-3 py-1 rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                            >
                                Anterior
                            </button>
                            <button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`bg-gray-300 px-3 py-1 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );

    return (
        <div id="MainPeticionarios" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <Toaster />
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">PETICIONARIOS</h2>
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

            {renderTable(columnsDNI, currentItemsDNI, currentPageDNI, setCurrentPageDNI, totalPagesDNI, handleDragEndDNI, 'Peticionarios (DNI)')}
            {renderTable(columnsNIF, currentItemsNIF, currentPageNIF, setCurrentPageNIF, totalPagesNIF, handleDragEndNIF, 'Peticionarios (NIF)')}

            <div className="flex justify-end mt-4">
                <button onClick={openAddModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Añadir Nuevo Peticionario
                </button>
            </div>

            <ModalPeticionarios
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addOrUpdatePeticionario}
                onUpdate={addOrUpdatePeticionario}
                peticionario={currentPeticionario}
                empresas={empresas}
            />

            {isEmpresaModalOpen && (
                <ModalEmpresas
                    isOpen={isEmpresaModalOpen}
                    onClose={() => setIsEmpresaModalOpen(false)}
                    onAddOrUpdate={(empresaData) => mutationAddEmpresa.mutate(empresaData)}
                    empresa={currentEmpresa}
                />
            )}

            <ModalGenerico
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmación"
                message="¿Seguro que quieres eliminar a este peticionario?"
            />
        </div>
    );
};

export default MainPeticionarios;