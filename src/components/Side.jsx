// src/MainSide.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faGear, faSync } from "@fortawesome/free-solid-svg-icons";
import "../css/Side.css"; // Asegúrate de que esta línea sea correcta

const MainSide = ({ isOpen, toggleSidebar, onRefresh }) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions); // Alternar el estado de opciones
    };

    return (
        <div id="MainSide" className={`fixed inset-y-0 left-0 z-30 transition-transform transform ${isOpen ? 'sidebar-open' : 'sidebar-closed'} bg-white shadow-lg w-64 p-4`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700">GestExp</h2>
                <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
                    {isOpen ? (
                        <FontAwesomeIcon icon={faXmark} className="text-gray-700" />
                    ) : (
                        <FontAwesomeIcon icon={faBars} className="text-gray-700" />
                    )}
                </button>
            </div>
            <nav className="flex flex-col">
                <ul className="space-y-2">
                    <li>
                        <Link to="/expedientes-principales" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                            Expedientes Principales
                        </Link>
                    </li>
                    <li>
                        <Link to="/expedientes-secundarios" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                            Expedientes Secundarios
                        </Link>
                    </li>
                    <li>
                        <Link to="/peticionarios" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                            Peticionarios
                        </Link>
                    </li>
                    <li>
                        <Link to="/empresas" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                            Empresas
                        </Link>
                    </li>
                </ul>

                {/* Opciones desplegables */}
                <div className="relative mt-4">
                    <button onClick={toggleOptions} className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 w-full">
                        <FontAwesomeIcon icon={faGear} className="mr-2" />
                        Opciones
                        <FontAwesomeIcon icon={showOptions ? faXmark : faBars} className="ml-auto" /> {/* Ícono para indicar si está abierto o cerrado */}
                    </button>
                    {showOptions && (
                        <ul className="mt-2 space-y-2 pl-4 bg-gray-50 rounded-md shadow-md">
                            <li>
                                <Link to="/clasificaciones" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                                    Clasificaciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/estados-expedientes" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                                    Estados Expedientes
                                </Link>
                            </li>
                            <li>
                                <Link to="/departamentos" className="block p-2 rounded-md hover:bg-gray-100 text-gray-700">
                                    Departamentos
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
            <div className="mt-auto">
                <button onClick={onRefresh} className="flex items-center p-2 mt-4 text-gray-700 hover:bg-gray-100 rounded-md">
                    <FontAwesomeIcon icon={faSync} className="mr-2" />
                    Refrescar
                </button>
            </div>
        </div>
    );
};

export default MainSide;
