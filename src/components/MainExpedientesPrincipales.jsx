import React, { useState, useEffect } from "react";
import busqueda from '../img/busqueda.png';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import ModalExpediente from './ModalExpediente';
import ModalGenerico from './ModalGenerico';
import { useMutation } from '@tanstack/react-query';
import { toast } from "sonner";

const MainExpedientesPrincipales = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);
    const [columns, setColumns] = useState([
        { id: 'solicitud', label: 'Solicitud', width: '10%' },
        { id: 'registro', label: 'Registro', width: '10%' },
        { id: 'fechaRegistro', label: 'Fecha de registro', width: '10%' },
        { id: 'expediente', label: 'Expediente', width: '10%' },
        { id: 'peticionario', label: 'Peticionario/Empresa', width: '12%' },
        { id: 'referenciaCatastral', label: 'Referencia Catastral', width: '8%' },
        { id: 'estadoExp', label: 'Estado Exp', width: '8%' },
        { id: 'departamento', label: 'Departamento', width: '8%' },
        { id: 'clasificacion', label: 'Clasificación', width: '8%' },
        { id: 'acciones', label: 'Acciones', width: '12%' }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmacionOpen, setIsModalConfirmacionOpen] = useState(false);
    const [expedienteToDelete, setExpedienteToDelete] = useState(null);
    const [expedienteToModify, setExpedienteToModify] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expedientes, setExpedientes] = useState([]);
    const [estadosExpedientes, setEstadosExpedientes] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);
    const [peticionarios, setPeticionarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [expedienteToDeleteId, setExpedienteToDeleteId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const savedExpedientes = localStorage.getItem('expedientesPrincipales');
        if (savedExpedientes) {
            setExpedientes(JSON.parse(savedExpedientes));
        } else {
            fetchExpedientes();
        }

        fetchEstadosExpedientes();
        fetchDepartamentos();
        fetchClasificaciones();
        fetchPeticionarios();
        fetchEmpresas();
    }, []);

    const fetchExpedientes = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/expedientesprincipales', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setExpedientes(data);
            localStorage.setItem('expedientesPrincipales', JSON.stringify(data));
        } catch (error) {
            toast.error('Error al cargar los expedientes principales', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const fetchEstadosExpedientes = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/estadosexpedientes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setEstadosExpedientes(data);
        } catch (error) {
            console.error("Error fetching estados expedientes:", error);
            toast.error('Error al cargar los estados de expedientes', {
                style: { background: '#F44336', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const fetchDepartamentos = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/departamentos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDepartamentos(await response.json());
        } catch (error) {
            console.error("Error fetching departamentos:", error);
        }
    };

    const fetchClasificaciones = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/clasificaciones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setClasificaciones(await response.json());
        } catch (error) {
            console.error("Error fetching clasificaciones:", error);
        }
    };

    const fetchPeticionarios = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/peticionarios', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPeticionarios(await response.json());
        } catch (error) {
            console.error("Error fetching peticionarios:", error);
        }
    };

    const fetchEmpresas = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/empresas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmpresas(await response.json());
        } catch (error) {
            console.error("Error fetching empresas:", error);
        }
    };

    const mutationSaveExpediente = useMutation({
        mutationFn: async (data) => {
            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `http://localhost:9000/api/expedientesprincipales/${data.id}` : 'http://localhost:9000/api/expedientesprincipales';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: (data) => {
            setExpedientes(prev => {
                const updatedExpedientes = data.id ? 
                    prev.map(e => e.id === data.id ? data : e) : 
                    [...prev, data];
                localStorage.setItem('expedientesPrincipales', JSON.stringify(updatedExpedientes));
                return updatedExpedientes;
            });
            setIsModalOpen(false);
            setExpedienteToModify(null);
            toast.success('Expediente guardado correctamente', { style: { background: '#4CAF50', color: 'white', fontWeight: 'bold' } });
        },
        onError: (error) => {
            toast.error('Error al guardar o actualizar el expediente:', { style: { background: '#F44336', color: 'white', fontWeight: 'bold' } });
            console.error('Error:', error.message);
        }
    });

    const mutationDeleteExpediente = useMutation({
        mutationFn: (id) =>
            fetch(`http://localhost:9000/api/expedientesprincipales/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }),
        onSuccess: () => {
            if (expedienteToDeleteId) {
                setExpedientes(prev => {
                    const updatedExpedientes = prev.filter(e => e.id.toString() !== expedienteToDeleteId.toString());
                    localStorage.setItem('expedientesPrincipales', JSON.stringify(updatedExpedientes));
                    return updatedExpedientes;
                });
                toast.success('Expediente eliminado correctamente', {
                    style: {
                        background: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                setIsModalConfirmacionOpen(false);
                setExpedienteToDeleteId(null);
            }
        },
        onError: (error) => {
            toast.error('Error al eliminar el expediente:', { style: { background: '#F44336', color: 'white', fontWeight: 'bold' } });
            console.error('Error:', error.message);
        }
    });

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setColumns(columns => {
                const oldIndex = columns.findIndex(item => item.id === active.id);
                const newIndex = columns.findIndex(item => item.id === over.id);
                return arrayMove(columns, oldIndex, newIndex);
            });
        }
    };

    const handleAddNew = () => {
        setIsModalOpen(true);
        setExpedienteToModify(null);
    };

    const handleModify = (expediente) => {
        const peticionario = peticionarios.find(p => p.id === expediente.peticionarioId) || { name: 'N/A' };
        const empresa = empresas.find(e => e.id === expediente.empresaId) || { name: 'N/A' };
        const estadoExp = estadosExpedientes.find(e => e.id === expediente.estadoId) || { name: 'N/A' };
        const departamento = departamentos.find(d => d.id === expediente.departamentoId) || { name: 'N/A' };
        const clasificacion = clasificaciones.find(c => c.id === expediente.clasificacionId) || { name: 'N/A' };

        setExpedienteToModify({
            ...expediente,
            peticionario: {
                value: expediente.peticionarioId,
                name: peticionario.name
            },
            empresa: {
                value: expediente.empresaId,
                name: empresa.name
            },
            estadoExpedienteId: expediente.estadoId,
            departamentoId: expediente.departamentoId,
            clasificacionId: expediente.clasificacionId,
        });
        setIsModalOpen(true);
    };

    const handleSave = (data) => {
        mutationSaveExpediente.mutate(data);
    };

    const handleDeleteConfirm = (expediente) => {
        setExpedienteToDelete(expediente);
        setExpedienteToDeleteId(expediente.id);
        setIsModalConfirmacionOpen(true);
    };

    const handleDelete = () => {
        if (expedienteToDelete) {
            mutationDeleteExpediente.mutate(expedienteToDelete.id);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const searchInNestedObject = (obj, searchTerm) => {
        if (!obj) return false;
        if (typeof obj === 'string' || typeof obj === 'number') {
            return obj.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (searchInNestedObject(obj[key], searchTerm)) {
                    return true;
                }
            }
        }
        return false;
    };

    const filteredExpedientes = expedientes.filter(expediente => {
        const searchTermLower = searchTerm.toLowerCase();
        if (Object.values(expediente).some(value =>
            value && typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
        )) {
            return true;
        }

        // ... filtrado adicional de acuerdo con tus necesidades ...
    });

    const totalPages = Math.ceil(filteredExpedientes.length / itemsPerPage);
    const currentItems = filteredExpedientes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPeticionarioOrEmpresaName = (expediente) => {
        if (expediente.peticionarioId) {
            return peticionarios.find(p => p.id === expediente.peticionarioId)?.name || 'N/A';
        } else if (expediente.empresaId) {
            return empresas.find(e => e.id === expediente.empresaId)?.name || 'N/A';
        }
        return 'N/A';
    };

    const renderTable = (columns, items) => (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns.filter(column => column.id !== 'acciones').map(column => column.id)} strategy={horizontalListSortingStrategy}>
                <table className="min-w-full border border-gray-300 table-fixed w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map(column => (
                                column.id !== 'acciones' ? (
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
                        {items.map((expediente) => (
                            <tr key={expediente.id} className="border-b hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={`${expediente.id}-${column.id}`} className="border px-4 py-2">
                                        {column.id === 'acciones' ? (
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleModify(expediente)} className="w-1/2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Modificar</button>
                                                    <button onClick={() => handleDeleteConfirm(expediente)} className="w-1/2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
                                                </div>
                                                <button onClick={() => console.log('Abrir modal adicional')} className="w-full bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Otras Acciones</button>
                                            </div>
                                        ) : column.id === 'fechaRegistro' ?
                                            formatDate(expediente.fechaRegistro)
                                            : column.id === 'peticionario' ?
                                                getPeticionarioOrEmpresaName(expediente)
                                                : column.id === 'referenciaCatastral' ?
                                                    <a href={`https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCConCiud.aspx?del=30&mun=1&UrbRus=U&RefC=${expediente[column.id] || ''}&Apenom=&esBice=&RCBice1=&RCBice2=&DenoBice=&from=nuevoVisor&ZV=NO&anyoZV=`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {expediente[column.id] || 'N/A'}
                                                    </a>
                                                    : column.id === 'estadoExp' ?
                                                        (estadosExpedientes.find(e => e.id === expediente.estadoExpedienteId)?.name || 'N/A')
                                                        : column.id === 'departamento' ?
                                                            (departamentos.find(d => d.id === expediente.departamentoId)?.name || 'N/A')
                                                            : column.id === 'clasificacion' ?
                                                                (clasificaciones.find(c => c.id === expediente.clasificacionId)?.name || 'N/A')
                                                                : expediente[column.id] || 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SortableContext>
        </DndContext>
    );

    return (
        <div id="MainExpedientesPrincipales" className={`bg-gray-200 p-5 rounded-lg transition-all duration-300 ${className}`}>
            <div id="Encabezado" className="mb-4">
                <div id="EncabezadoTabla" className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">EXPEDIENTES PRINCIPALES</h2>
                    <div id="filtroContainer" className="flex items-center">
                        <input
                            type="text"
                            id="filtro"
                            className="border rounded p-2 w-64 transition-all duration-300"
                            onFocus={toggleFiltro}
                            onBlur={toggleFiltro}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" className="ml-2 w-6 h-6 cursor-pointer" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                {renderTable(columns, currentItems)}
                <div className="flex justify-between items-center mt-4">
                    <span>Página {currentPage} de {totalPages}</span>
                    <div className="flex">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`bg-gray-300 px-3 py-1 rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Anterior
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`bg-gray-300 px-3 py-1 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button onClick={handleAddNew} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Añadir Nuevo
                </button>
            </div>
            <ModalExpediente
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setExpedienteToModify(null);
                }}
                onSave={handleSave}
                estados={estadosExpedientes}
                departamentos={departamentos}
                clasificaciones={clasificaciones}
                peticionarios={peticionarios}
                empresas={empresas}
                expediente={expedienteToModify || {}}
            />
            <ModalGenerico
                isOpen={isModalConfirmacionOpen}
                onClose={() => setIsModalConfirmacionOpen(false)}
                onConfirm={handleDelete}
                title="Confirmación"
                message="¿Estás seguro de que deseas eliminar este expediente?"
            />
        </div>
    );
};

export default MainExpedientesPrincipales;