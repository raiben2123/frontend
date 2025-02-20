import React, { useState, useEffect } from 'react';

const ModalClasificaciones = ({ isOpen, onClose, clasificacion, onAdd, onUpdate }) => {
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');

    // Este efecto se ejecuta cada vez que se abre el modal o se selecciona una clasificación
    useEffect(() => {
        if (isOpen) {
            if (clasificacion) {
                setName(clasificacion.name);
                setAcronym(clasificacion.acronym);
            } else {
                setName('');
                setAcronym('');
            }
        }
    }, [isOpen, clasificacion]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (clasificacion) {
            onUpdate({ ...clasificacion, name, acronym });
        } else {
            onAdd({ name, acronym });
        }
        onClose(); // Cierra el modal después de agregar o actualizar
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform-gpu">
                <h2 className="text-lg font-semibold mb-4">{clasificacion ? 'Modificar Clasificación' : 'Añadir Clasificación'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Siglas</label>
                        <input
                            type="text"
                            value={acronym}
                            onChange={(e) => setAcronym(e.target.value)}
                            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Cancelar</button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                            {clasificacion ? 'Actualizar' : 'Añadir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalClasificaciones;
