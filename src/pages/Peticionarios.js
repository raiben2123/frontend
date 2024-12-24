import React, { useState } from "react";
import MainHeader from "../components/Header";
import Side from "../components/Side"
import MainPeticionarios from "../components/MainPeticionarios"

const Peticionarios = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar el sidebar

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Alternar el estado del sidebar
    };
    return (
        <div id="Home">
            <MainHeader />
            <div id="Contenido" style={{ display: "flex" }}>
                <Side isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pasar estado y función */}
                <MainPeticionarios className={isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'} /> {/* Cambiar clase */}
            </div>
        </div>
    );
};

export default Peticionarios;