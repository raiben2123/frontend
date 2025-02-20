// src/MainHeader.jsx

import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';

const MainHeader = ({ toggleSidebar, isSidebarOpen }) => {
    const username = localStorage.getItem('username') || 'Usuario'; // Obtener el nombre del usuario de localStorage

    return (
        <header id="divHeader" className="bg-white shadow">
            <div id="divContenido" className="flex justify-between items-center p-4">
                {/* Botón para alternar el sidebar, solo visible si el sidebar está cerrado */}
                {!isSidebarOpen && (
                    <button onClick={toggleSidebar} className="text-gray-700">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                )}
                {/* Título con enlace a /dashboard */}
                <h2 id="h2Header" className="flex-1 text-center">
                    <Link to="/dashboard">GESTOR DE EXPEDIENTES</Link>
                </h2>
                {/* Sección del usuario */}
                <div id="Usuario" className="flex items-center">
                    <FontAwesomeIcon icon={faUserCircle} id="iconoUsuario" />
                    <span id="nombreUsuario">{username}</span>
                </div>
            </div>
            <hr />
        </header>
    );
};

export default MainHeader;
