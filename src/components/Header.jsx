import React from 'react';
import '../css/Header.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Icono de usuario

const MainHeader = () => {
    return (
        <header id="divHeader">
            <div id="divContenido">
                {/* Título con enlace */}
                <h2 id="h2Header">
                    <Link to="/">GESTOR DE EXPEDIENTES</Link>
                </h2>

            {/* Sección del usuario */}
            <div id="Usuario">
                <FontAwesomeIcon icon={faUserCircle} id="iconoUsuario" />
                <span id="nombreUsuario">Usuario</span>
            </div>
        </div>
        <hr />
    </header>
);
};

export default MainHeader;