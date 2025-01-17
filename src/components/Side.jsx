import React, { useState } from "react";
import "../css/Side.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faGear, faSync } from "@fortawesome/free-solid-svg-icons";

const MainSide = ({ isOpen, toggleSidebar, onRefresh }) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    return (
        <div id="MainSide" className={isOpen ? "sidebar-open" : "sidebar-closed"}>
            <div className="sidebar-header">
                <button onClick={toggleSidebar} className="toggle-btn">
                    {isOpen ? (
                        <FontAwesomeIcon icon={faXmark} className="icon" />
                    ) : (
                        <FontAwesomeIcon icon={faBars} className="icon" />
                    )}
                </button>
            </div>
            <nav className="sidebar-content">
                <ul className="sidebar-list">
                    <li>
                        <Link to="/expedientes-principales" className="enlace">
                            Expedientes Principales
                        </Link>
                    </li>
                    <li>
                        <Link to="/expedientes-secundarios" className="enlace">
                            Expedientes Secundarios
                        </Link>
                    </li>
                    <li>
                        <Link to="/peticionarios" className="enlace">
                            Peticionarios
                        </Link>
                    </li>
                    <li>
                        <Link to="/empresas" className="enlace">
                            Empresas
                        </Link>
                    </li>
                </ul>
                <div className="sidebar-options">
                    <button onClick={toggleOptions} className="options-btn">
                        <FontAwesomeIcon icon={faGear} className="icon" />
                    </button>
                    {showOptions && (
                        <ul className="options-list">
                            <li>
                                <Link to="/clasificaciones" className="enlace">
                                    Clasificaciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/estados-expedientes" className="enlace">
                                    Estados Expedientes
                                </Link>
                            </li>
                            <li>
                                <Link to="/departamentos" className="enlace">
                                    Departamentos
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
            <div className="refresh-data">
                <button onClick={onRefresh} className="refresh-btn">
                    <FontAwesomeIcon icon={faSync} className="icon" />
                </button>
                <span className="refresh-label">Refrescar</span>
            </div>
        </div>
    );
};

export default MainSide;