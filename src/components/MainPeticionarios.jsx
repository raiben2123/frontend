import React, { useState, useEffect } from "react";
import '../css/MainPeticionarios.css';
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalPeticionarios from './ModalPeticionarios';
import ModalGenerico from './ModalGenerico';
import ModalEmpresas from './ModalEmpresas';

const MainPeticionarios = ({ className }) => {
    const [peticionarios, setPeticionarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
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

    const fetchPeticionarios = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/peticionarios');
            if (!response.ok) {
                throw new Error('Error al obtener los peticionarios');
            }
            const data = await response.json();
            setPeticionarios(data);
        } catch (error) {
            console.error(error);
        }
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
        fetchPeticionarios();
        fetchEmpresas();
    }, []);

    // Function to open modal for adding a new peticionario
    const openAddModal = () => {
        setCurrentPeticionario(null);
        setIsModalOpen(true);
    };

    // Function to open modal for editing a peticionario
    const openEditModal = (peticionario) => {
        const peticionarioConEmpresa = {
            ...peticionario,
            representa: peticionario.representa
                ? { ...peticionario.representa, nif: peticionario.representa.nif }
                : null,
        };
        setCurrentPeticionario(peticionarioConEmpresa);
        setIsModalOpen(true);
    };

    // Function to add or update a peticionario
    const addOrUpdatePeticionario = async (peticionarioData) => {
        try {
            // Verificar si hay un nombre de representante
            if (peticionarioData.representa && peticionarioData.representa.name) {
                // Aquí abres el ModalEmpresas si hay un nombre de representante
                setCurrentEmpresa(peticionarioData.representa);
                setIsEmpresaModalOpen(true);
                return; // Salimos de la función para no continuar
            }
            const response = peticionarioData.id
                ? await fetch(`http://localhost:8081/api/peticionarios/${peticionarioData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(peticionarioData),
                })
                : await fetch('http://localhost:8081/api/peticionarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(peticionarioData),
                });
    
            if (!response.ok) {
                throw new Error('Error al guardar el peticionario');
            }
    
            fetchPeticionarios(); // Refrescar la lista
            setIsModalOpen(false); // Cerrar el modal después de añadir/actualizar
        } catch (error) {
            console.error('Error al guardar el peticionario:', error);
        }
    };

    // Open the delete confirmation modal
    const openDeleteModal = (id) => {
        setPeticionarioToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Function to confirm deletion
    const confirmDelete = async () => {
        if (peticionarioToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/peticionarios/${peticionarioToDelete}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar el peticionario');
                }
                fetchPeticionarios(); // Refresh the list
                setIsDeleteModalOpen(false); // Close the modal after deleting
                setPeticionarioToDelete(null); // Clear the selected peticionario to delete
            } catch (error) {
                console.error('Error al eliminar el peticionario:', error);
            }
        }
    };

    const filteredPeticionariosDNI = peticionarios
        .filter(p => p.dni && (
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

    const filteredPeticionariosNIF = peticionarios
        .filter(p => p.nif && (
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

    return (
        <div id="MainPeticionarios" className={className}>
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
                                                        peticionario.representa ? peticionario.representa.name : ''
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
                                                        peticionario.representa ? peticionario.representa.name : ''
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
                />
            )}

            {isEmpresaModalOpen && (
                <ModalEmpresas
                    isOpen={isEmpresaModalOpen}
                    onClose={() => setIsEmpresaModalOpen(false)}
                    onAddOrUpdate={async (empresaData) => {
                        try {
                            const response = await fetch('http://localhost:8081/api/empresas', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(empresaData),
                            });
                            const newEmpresa = await response.json();
                            setEmpresas([...empresas, newEmpresa]);
                            setIsEmpresaModalOpen(false);
                            addOrUpdatePeticionario({
                                ...currentPeticionario,
                                representa: newEmpresa
                            });
                        } catch (error) {
                            console.error('Error al agregar la empresa:', error);
                        }
                    }}
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