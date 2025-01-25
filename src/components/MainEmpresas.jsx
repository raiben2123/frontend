import React, { useState } from "react";
import '../css/MainEmpresas.css';
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalEmpresas from './ModalEmpresas';
import ModalGenerico from './ModalGenerico';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { fetchEmpresas, fetchPeticionarios } from "../api/apiService";

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

    const queryClient = useQueryClient();

    // Use Query for fetching empresas
    const { data: empresas, isLoading, isError } = useQuery({
        queryKey: ['empresas'],
        queryFn: fetchEmpresas
    });

    const { data: peticionarios} = useQuery({
        queryKey: ['peticionarios'],
        queryFn: fetchPeticionarios
    });

    // Mutation for adding or updating an empresa
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
                },
                body: JSON.stringify(empresaData),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empresas'] });
            toast.success('Empresa guardada correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsModalOpen(false);
            setSelectedEmpresa(null);
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

    // Mutation for deleting empresa
    const mutationDeleteEmpresa = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:9000/api/empresas/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empresas'] });
            toast.success('Empresa eliminada correctamente', {
                style: {
                    background: '#4CAF50',
                    color: 'white',
                    fontWeight: 'bold'
                }
            });
            setIsModalConfirmacionOpen(false);
            setEmpresaToDelete(null);
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

    const filteredEmpresas = Array.isArray(empresas) ? empresas.filter(empresa =>
        Object.keys(empresa).some(key =>
            String(empresa[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];

    const currentItems = filteredEmpresas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setColumns(columns => {
                const oldIndex = columns.findIndex(c => c.id === active.id);
                const newIndex = columns.findIndex(c => c.id === over.id);
                return arrayMove(columns, oldIndex, newIndex);
            });
        }
    };

    if (isLoading) return <div>Cargando empresas...</div>;
    if (isError) return <div>Error al cargar datos: {isError.message}</div>;
    return (
        <div id="MainEmpresas" className={className}>
            <Toaster />
            <div id="Encabezado">
                <h2>EMPRESAS</h2>
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

            <button onClick={() => { setSelectedEmpresa(null); setIsModalOpen(true); }}>Añadir Nueva Empresa</button>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={columns.filter(column => column.id !== 'actions').map(column => column.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div id="TablaEmpresas">
                        <div id="SubEncabezadoTabla">
                            <h3>Empresas</h3>
                        </div>
                        <div id="CuerpoTabla">
                            <table>
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            column.id !== 'actions' ?
                                                <SortableItem key={column.id} id={column.id}>
                                                    {column.label}
                                                </SortableItem>
                                                :
                                                <th key={column.id}>{column.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((empresa) => (
                                        <tr key={empresa.id}>
                                            {columns.map((column) => (
                                                <td key={column.id}>
                                                    {column.id === 'actions' ? (
                                                        <>
                                                            <button onClick={() => { setSelectedEmpresa(empresa); setIsModalOpen(true); }}>Modificar</button>
                                                            <button className="btn-delete" onClick={() => { setEmpresaToDelete(empresa.id); setIsModalConfirmacionOpen(true); }}>Eliminar</button>
                                                        </>
                                                    ) : column.id === 'representante' ? (
                                                        empresa.representanteId ?
                                                            (peticionarios && peticionarios.find(p => p.id === empresa.representanteId)?.name + " " + peticionarios.find(p => p.id === empresa.representanteId)?.surname) || '' : ''
                                                    ) : (
                                                        empresa[column.id]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div id="PaginacionEmpresas">
                                <span>Página {currentPage} de {totalPages}</span>
                                <div id="Botones">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            <ModalEmpresas
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddOrUpdate={(empresa) => mutationEmpresa.mutate(empresa)}
                empresa={selectedEmpresa}
            />

            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar esta empresa?"
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={() => mutationDeleteEmpresa.mutate(empresaToDelete)}
            />
        </div>
    );
};

export default MainEmpresas;