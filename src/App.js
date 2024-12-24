import './App.css';
import Home from './pages/Home'
import ExpedientesPrincipales from './pages/ExpedientesPrincipales';
import ExpedientesSecundarios from './pages/ExpedientesSecundarios';
import Empresas from './pages/Empresas';
import Peticionarios from './pages/Peticionarios';
import Clasificaciones from './pages/Clasificaciones'
import EstadosExpedientes from './pages/EstadosExpedientes'
import Departamentos from './pages/Departamentos'


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clasificaciones" element={<Clasificaciones />} />
        <Route path="/estados-expedientes" element={<EstadosExpedientes />} />
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/peticionarios" element={<Peticionarios />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/expedientes-secundarios" element={<ExpedientesSecundarios />} />
        <Route path="/expedientes-principales" element={<ExpedientesPrincipales />} />
      </Routes>
    </Router>
  );
}

export default App;

