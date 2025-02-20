import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const WidgetGrid = ({ userRole }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableWidgets, setAvailableWidgets] = useState([
        "Clasificaciones",
        "Departamentos",
        "Empresas",
        "Estados Expedientes",
        "Peticionarios",
        "Expedientes Principales",
        "Expedientes Secundarios"
    ]);
    const [selectedWidgets, setSelectedWidgets] = useState([]);

    useEffect(() => {
        const storedWidgets = localStorage.getItem("userWidgets");
        if (storedWidgets) {
            setSelectedWidgets(JSON.parse(storedWidgets));
        }
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const addWidget = (widgetName) => {
        if (!selectedWidgets.includes(widgetName)) {
            setSelectedWidgets((prev) => [...prev, widgetName]);
        }
    };

    const removeWidget = (widgetName) => {
        setSelectedWidgets((prev) => prev.filter(widget => widget !== widgetName));
    };

    const saveWidgets = () => {
        localStorage.setItem("userWidgets", JSON.stringify(selectedWidgets));
        closeModal();
    };

    const widgetRedirects = {
        "Clasificaciones": "/clasificaciones",
        "Departamentos": "/departamentos",
        "Empresas": "/empresas",
        "Estados Expedientes": "/estados-expedientes",
        "Peticionarios": "/peticionarios",
        "Expedientes Principales": "/expedientes-principales",
        "Expedientes Secundarios": "/expedientes-secundarios"
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
                {selectedWidgets.map((widget) => (
                    <div key={widget} className="bg-gray-200 p-4 rounded-md relative">
                        <Link to={widgetRedirects[widget]} className="cursor-pointer">
                            {widget}
                        </Link>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeWidget(widget);
                            }}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {userRole === 'ADMIN' && (
                    <div className="bg-yellow-200 p-4 rounded-md">
                        <p>Widget de Administración (Próximamente)</p>
                    </div>
                )}
                <div
                    className="bg-blue-500 text-white p-4 rounded-md flex items-center justify-center cursor-pointer"
                    onClick={openModal}
                >
                    <span className="text-2xl">+</span>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        margin: 'auto',
                        maxWidth: '600px',
                        width: '90%',
                        height: 'auto',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                    },
                }}
            >
                <h2 className="text-lg font-semibold mb-4">Selecciona Widgets</h2>
                <div className="grid grid-cols-1 gap-4">
                    {availableWidgets.map((widget, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span>{widget}</span>
                            {selectedWidgets.includes(widget) ? (
                                <span className="text-green-600">✓ Añadido</span>
                            ) : (
                                <button
                                    onClick={() => addWidget(widget)}
                                    className="p-1 bg-blue-500 text-white rounded-md"
                                >
                                    Añadir
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button onClick={saveWidgets} className="bg-green-500 text-white px-4 py-2 rounded-md">
                        Guardar
                    </button>
                    <button onClick={closeModal} className="ml-2 bg-gray-300 px-4 py-2 rounded-md">
                        Cancelar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

Modal.setAppElement('#root');

export default WidgetGrid;
