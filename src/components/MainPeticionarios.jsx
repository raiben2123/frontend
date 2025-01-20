import React, { useState } from "react";
import '../css/MainPeticionarios.css';
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalPeticionarios from './ModalPeticionarios';
import ModalGenerico from './ModalGenerico';
import ModalEmpresas from './ModalEmpresas';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

const MainPeticionarios = ({ className }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageDNI, setCurrentPageDNI] = useState(1);
    const [currentPageNIF, setCurrentPageNIF] = useState(1);
    const itemsPerPage = 4;
    const [columnsDNI, setColumnsDNI] = useState([
        { id: 'dni', label: 'DNI' },
        { id: 'name', label: 'Nombre' },
        { id: 'surname', label: 'Apellido' },
        { id: 'tlf', label: 'Teléfono' },
        { id: 'email', label: 'Email' },
        { id: 'address', label: 'Dirección' },
        { id: 'representa', label: 'Representa' },
        { id: 'actions', label: 'Acciones' }
    ]);
    const [columnsNIF, setColumnsNIF] = useState([
        { id: 'nif', label: 'NIF' },
        { id: 'name', label: 'Nombre' },
        { id: 'surname', label: 'Apellido' },
        { id: 'tlf', label: 'Teléfono' },
        { id: 'email', label: 'Email' },
        { id: 'address', label: 'Dirección' },
        { id: 'representa', label: 'Representa' },
        { id: 'actions', label: 'Acciones' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPeticionario, setCurrentPeticionario] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [peticionarioToDelete, setPeticionarioToDelete] = useState(null);
    const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
    const [currentEmpresa, setCurrentEmpresa] = useState(null);

    const queryClient = useQueryClient();

    // Use Query for fetch peticionarios
    const { data: peticionarios, isLoading: loadingPeticionarios, isError: errorPeticionarios } = useQuery({
        queryKey: ['peticionarios'],
        queryFn: () => fetch('http://localhost:8081/api/peticionarios').then(res => res.json()),
    });

    const { data: empresas, isLoading: loadingEmpresas, isError: errorEmpresas } = useQuery({
        queryKey: ['empresas'],
        queryFn: () => fetch('http://localhost:8081/api/empresas').then(res => res.json()),
    });

    const mutationPeticionario = useMutation({
        mutationFn: (peticionarioData) => {
            console.log('Datos del peticionario antes de enviar:', peticionarioData);
            
            let url, method;
            if (peticionarioData.id) {
                url = `http://localhost:8081/api/peticionarios/${peticionarioData.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:8081/api/peticionarios';
                method = 'POST';
            }
    
            console.log('URL:', url);
            console.log('Método:', method);
            
            return fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(peticionarioData),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['peticionarios'] });
            toast.success('Peticionario guardado correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsModalOpen(false);
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

    // Mutation for deleting peticionario
    const mutationDeletePeticionario = useMutation({
        mutationFn: (id) => 
            fetch(`http://localhost:8081/api/peticionarios/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['peticionarios'] });
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

    // Mutation for adding empresa
    const mutationAddEmpresa = useMutation({
        mutationFn: (empresaData) => 
            fetch('http://localhost:8081/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            }),
        onSuccess: (response) => {
            const newEmpresa = response.json();
            queryClient.setQueryData(['empresas'], old => [...old, newEmpresa]);
            toast.success('Empresa añadida correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsEmpresaModalOpen(false);
            mutationPeticionario.mutate({ ...currentPeticionario, representa: newEmpresa });
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
        // Si 'representa' solo contiene el ID, busca la empresa correspondiente
        let representa = null;
        if (peticionario.representa) {
            const empresa = empresas && empresas.find(e => e.id === peticionario.representa);
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
            // Si estamos representando una empresa, buscamos la empresa por su ID
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

    const filteredPeticionariosDNI = Array.isArray(peticionarios) ? peticionarios.filter(p => p.dni && (
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
    )) : [];

    const filteredPeticionariosNIF = Array.isArray(peticionarios) ? peticionarios.filter(p => p.nif && (
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
    )) : [];

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

    if (loadingPeticionarios || loadingEmpresas) return <div>Cargando peticionarios y empresas...</div>;
    if (errorPeticionarios || errorEmpresas) return <div>Error al cargar datos: {errorPeticionarios?.message || errorEmpresas?.message}</div>;
    return (
        <div id="MainPeticionarios" className={className}>
            <Toaster />
            <div id="Encabezado">
                <h2>PETICIONARIOS</h2>
                <div id="filtroContainer">
                    <input
                        type="text"
                        id="filtro"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={busqueda} alt="Buscar" id="lupa" />
                </div>
            </div>

            <button onClick={openAddModal}>Añadir Nuevo Peticionario</button>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndDNI}>
                <SortableContext items={columnsDNI.filter(column => column.id !== 'actions').map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div id="TablaDNI">
                        <div id="SubEncabezadoTabla">
                            <h3>Peticionarios (DNI)</h3>
                        </div>
                        <div id="CuerpoTabla">
                            <table>
                                <thead>
                                    <tr>
                                        {columnsDNI.map((column) => (
                                            column.id !== 'actions' ? (
                                                <SortableItem key={column.id} id={column.id}>
                                                    {column.label}
                                                </SortableItem>
                                            ) : (
                                                <th key={column.id}>{column.label}</th>
                                            )
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItemsDNI.map((peticionario) => (
                                        <tr key={peticionario.id}>
                                            {columnsDNI.map((column) => (
                                                <td key={column.id}>
                                                    {column.id === 'actions' ? (
                                                        <>
                                                            <button onClick={() => openEditModal(peticionario)}>Modificar</button>
                                                            <button className="btn-delete" onClick={() => openDeleteModal(peticionario.id)}>Eliminar</button>
                                                        </>
                                                    ) : column.id === 'representa' ? (
                                                        // Si 'representa' solo tiene ID, buscamos la empresa aquí
                                                        peticionario.representaId ? 
                                                            ((empresas && empresas.find(e => e.id === peticionario.representaId)?.name) || 'Empresa no encontrada') 
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
                            <div id="PaginacionDNI">
                                <span>Página {currentPageDNI} de {totalPagesDNI}</span>
                                <div id="Botones">
                                    <button disabled={currentPageDNI === 1} onClick={() => setCurrentPageDNI(currentPageDNI - 1)}>Anterior</button>
                                    <button disabled={currentPageDNI === totalPagesDNI} onClick={() => setCurrentPageDNI(currentPageDNI + 1)}>Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndNIF}>
                <SortableContext items={columnsNIF.filter(column => column.id !== 'actions').map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div id="TablaNIF">
                        <div id="SubEncabezadoTabla">
                            <h3>Peticionarios (NIF)</h3>
                        </div>
                        <div id="CuerpoTabla">
                            <table>
                                <thead>
                                    <tr>
                                        {columnsNIF.map((column) => (
                                            column.id !== 'actions' ? (
                                                <SortableItem key={column.id} id={column.id}>
                                                    {column.label}
                                                </SortableItem>
                                            ) : (
                                                <th key={column.id}>{column.label}</th>
                                            )
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItemsNIF.map((peticionario) => (
                                        <tr key={peticionario.id}>
                                            {columnsNIF.map((column) => (
                                                <td key={column.id}>
                                                    {column.id === 'actions' ? (
                                                        <>
                                                            <button onClick={() => openEditModal(peticionario)}>Modificar</button>
                                                            <button className="btn-delete" onClick={() => openDeleteModal(peticionario.id)}>Eliminar</button>
                                                        </>
                                                    ) : column.id === 'representa' ? (
                                                        peticionario.representaId ? 
                                                        ((empresas && empresas.find(e => e.id === peticionario.representaId)?.name) || 'Empresa no encontrada') : ''
                                                    ) : (
                                                        peticionario[column.id]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div id="PaginacionNIF">
                                <span>Página {currentPageNIF} de {totalPagesNIF}</span>
                                <div id="Botones">
                                    <button disabled={currentPageNIF === 1} onClick={() => setCurrentPageNIF(currentPageNIF - 1)}>Anterior</button>
                                    <button disabled={currentPageNIF === totalPagesNIF} onClick={() => setCurrentPageNIF(currentPageNIF + 1)}>Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </SortableContext>
            </DndContext>

            {isModalOpen && (
                <ModalPeticionarios
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={addOrUpdatePeticionario}
                    onUpdate={addOrUpdatePeticionario}
                    peticionario={currentPeticionario}
                    empresas={empresas}
                />
            )}

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
                title="Eliminar peticionario"
                message="¿Seguro que quiere eliminar a este peticionario?"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default MainPeticionarios;