// ModalGenerico.js
import React from 'react';
import '../css/ModalGenerico.css'; // Asegúrate de agregar estilos si es necesario.

const ModalGenerico = ({ isOpen, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Confirmar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalGenerico;
