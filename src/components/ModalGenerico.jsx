import React from 'react';

const ModalGenerico = ({ isOpen, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;
    const handleConfirm = () => {
        onConfirm();  // Ejecuta la función onConfirm cuando se hace clic en Confirmar
        onClose();    // Cierra el modal después de confirmar
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="text-sm mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalGenerico;
