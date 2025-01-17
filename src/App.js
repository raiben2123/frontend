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
import { ClasificacionesProvider } from './contexts/ClasificacionesContext'; // Importa el provider
import { EstadosProvider } from './contexts/EstadosContext'; // Crearemos este contexto
import { DepartamentosProvider } from './contexts/DepartamentosContext'; // Crearemos este contexto
import { PeticionariosProvider } from './contexts/PeticionariosContext'; // Crearemos este contexto

const App = () => {
  return (
    <Router>
      <ClasificacionesProvider>
        <EstadosProvider>
          <DepartamentosProvider>
            <PeticionariosProvider>
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
            </PeticionariosProvider>
          </DepartamentosProvider>
        </EstadosProvider>
      </ClasificacionesProvider>
    </Router>
  );
}

export default App;