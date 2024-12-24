import React, { useState, useEffect } from "react";
import '../css/MainEmpresas.css';
import busqueda from '../img/busqueda.png';
import ModalEmpresas from './ModalEmpresas';
import ModalGenerico from './ModalGenerico';
import ModalPeticionarios from './ModalPeticionarios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const MainEmpresas = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [isModalNuevoRepresentanteOpen, setIsModalNuevoRepresentanteOpen] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [empresaToDelete, setEmpresaToDelete] = useState(null);
    const [columns, setColumns] = useState([
        { id: 'cif', label: 'CIF' },
        { id: 'name', label: 'Nombre' },
        { id: 'address', label: 'Dirección' },
        { id: 'tlf', label: 'Teléfono' },
        { id: 'email', label: 'Email' },
        { id: 'representante', label: 'Representante' },
        { id: 'actions', label: 'Acciones' }
    ]);

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const fetchEmpresas = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/empresas');
            if (!response.ok) {
                throw new Error('Error al obtener las empresas');
            }
            const data = await response.json();
            setEmpresas(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const handleAddOrUpdate = async (empresa) => {
        const isCIF = /^[A-Z]\d{8}$/.test(empresa.cif); // Validar si es CIF

        if (!isCIF) {
            alert("El formato de CIF es incorrecto");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/empresas${empresa.id ? `/${empresa.id}` : ''}`, {
                method: empresa.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresa),
            });
            if (!response.ok) {
                throw new Error('Error al guardar la empresa');
            }
            fetchEmpresas();
            setIsModalOpen(false);
            setSelectedEmpresa(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (empresaToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/empresas/${empresaToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar la empresa');
                }
                fetchEmpresas();
                setEmpresaToDelete(null);
                setIsModalConfirmacionOpen(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openDeleteModal = (id) => {
        setEmpresaToDelete(id);
        setIsModalConfirmacionOpen(true);
    };

    const filteredEmpresas = empresas
        .filter(e => (
            e.cif.includes(searchTerm) ||
            (e.name && e.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (e.address && e.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (e.tlf && e.tlf.includes(searchTerm)) ||
            (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (e.representante && (
                e.representante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.representante.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.representante.dni.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        ));

    const currentItems = filteredEmpresas.slice(
        (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setColumns((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div id="MainEmpresas" className={className}>
            <div id="Encabezado">
                <h2>EMPRESAS</h2>
                <div id="filtroContainer">
                    <input
                        type="text"
                        id="filtro"
                        className={filtroExpanded ? 'expanded' : ''}
                        onFocus={toggleFiltro}
                        onBlur={toggleFiltro}
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={busqueda} alt="Buscar" id="lupa" />
                </div>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={columns.filter(column => column.id !== 'actions').map(column => column.id)} strategy={horizontalListSortingStrategy}>
                    <div id="TablaEmpresas">
                        <div id="SubEncabezadoTabla">
                            <h3>Empresas</h3>
                        </div>
                        <div id="CuerpoTabla">
                            <table>
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
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
                                    {currentItems.map((empresa) => (
                                        <tr key={empresa.id}>
                                            {columns.map((column) => (
                                                <td key={column.id}>
                                                    {column.id === 'actions' ? (
                                                        <>
                                                            <button onClick={() => { setSelectedEmpresa(empresa); setIsModalOpen(true); }}>Modificar</button>
                                                            <button className="btn-delete" onClick={() => openDeleteModal(empresa.id)}>Eliminar</button>
                                                        </>
                                                    ) : column.id === 'representante' ? (
                                                        empresa.representante ? `${empresa.representante.name} ${empresa.representante.surname}` : ''
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
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            <div id="Botones">
                <button onClick={() => { setSelectedEmpresa(null); setIsModalOpen(true); }}>Añadir Nuevo</button>
            </div>

            <ModalEmpresas
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddOrUpdate={handleAddOrUpdate}
                empresa={selectedEmpresa}
                onNuevaRepresentante={() => setIsModalNuevoRepresentanteOpen(true)}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar esta empresa?"
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={handleDelete}
            />
            <ModalPeticionarios
                isOpen={isModalNuevoRepresentanteOpen}
                onClose={() => setIsModalNuevoRepresentanteOpen(false)}
                onAddOrUpdate={fetchEmpresas}
                peticionario={null}
            />
        </div>
    );
};

export default MainEmpresas;