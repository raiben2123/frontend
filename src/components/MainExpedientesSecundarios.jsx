import React, { useState } from "react";
import '../css/MainExpedientesSecundarios.css';
import busqueda from '../img/busqueda.png';

const MainExpedientesSecundarios = ({ className }) => {
    const [filtroExpanded, setFiltroExpanded] = useState(false);

    const toggleFiltro = () => {
        setFiltroExpanded(!filtroExpanded);
    };

    return (
        <div id="MainExpedientesSecundarios" className={className}>
            <div id="Encabezado">
                <div id="EncabezadoTabla">
                    <h2>EXPEDIENTES SECUNDARIOS</h2>
                    <div id="filtroContainer">
                        <input
                            type="text"
                            id="filtro"
                            className={filtroExpanded ? 'expanded' : ''}
                            onFocus={toggleFiltro}
                            onBlur={toggleFiltro}
                            placeholder="Buscar..."
                        />
                        <img src={busqueda} alt="Buscar" id="lupa" />
                    </div>
                </div>
            </div>
            <div id="CuerpoTabla">
                <table>
                    <thead>
                        <tr>
                            <th>Expediente Principal</th>
                            <th>Solicitud</th>
                            <th>Registro</th>
                            <th>Fecha de registro</th>
                            <th>Expediente</th>
                            <th>Peticionario</th>
                            <th>Referencia Catastral</th>
                            <th>Estado Exp</th>
                            <th>Departamento</th>
                            <th>Clasificación</th>
                            <th>Modificar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí irían las filas de datos */}
                    </tbody>
                </table>
                <div id="Paginacion">
                    <span>Página 1 de 10</span>
                    <div id="Botones">
                        <button>Anterior</button>
                        <button>Siguiente</button>
                    </div>
                </div>
                <div id="Botones">
                    <button>Añadir Nuevo</button>
                    <button>Eliminar</button>
                </div>
            </div>
        </div>
    );
};

export default MainExpedientesSecundarios;
