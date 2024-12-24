import React from "react";
import "../css/MainContent.css";
import { Link } from "react-router-dom";

const MainContent = ({ className }) => {
    return (
        <div id="MainContent" className={className}>
            <div className="card-container">
                <Link to="/expedientes-principales" className="card">
                    <h3>EXPEDIENTES PRINCIPALES</h3>
                </Link>
                <Link to="/expedientes-secundarios" className="card">
                    <h3>EXPEDIENTES SECUNDARIOS</h3>
                </Link>
                <Link to="/empresas" className="card">
                    <h3>EMPRESAS</h3>
                </Link>
                <Link to="/peticionarios" className="card">
                    <h3>PETICIONARIOS</h3>
                </Link>
            </div>
        </div>
    );
};

export default MainContent;
