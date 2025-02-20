import React, { useState } from "react";
import Header from "../components/Header";
import Side from "../components/Side";
import MainClasificaciones from "../components/MainClasificaciones";

const Clasificaciones = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar el sidebar

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Alternar el estado del sidebar
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Barra lateral */}
            <Side isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Contenido principal */}
            <div className="flex flex-col flex-1 bg-white shadow-lg">
                {/* Encabezado */}
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                {/* Área de contenido principal */}
                <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`} style={{ marginTop: '0' }}>
                    <MainClasificaciones />
                </div>
            </div>
        </div>
    );
};

export default Clasificaciones;
