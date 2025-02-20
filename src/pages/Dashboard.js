import React, { useState } from "react";
import Side from "../components/Side";
import Header from "../components/Header";
import WidgetGrid from "../components/WidgetGrid"; // Asegúrate de que este componente esté definido.

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar el sidebar

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Alternar el estado del sidebar
    };

    // Suponiendo que el rol del usuario se obtiene de alguna manera
    const userRole = 'USER'; // Cambia esto según sea necesario (puede ser ADMIN o USER)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Barra lateral */}
            <Side isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Contenido principal */}
            <div className="flex flex-col flex-1">
                {/* Encabezado */}
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                {/* Área de contenido principal */}
                <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`} style={{ marginTop: '0' }}>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>

                    {/* Área de widgets */}
                    <WidgetGrid userRole={userRole} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
