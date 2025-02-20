import './App.css';
import Home from './pages/Home';
import ExpedientesPrincipales from './pages/ExpedientesPrincipales';
import ExpedientesSecundarios from './pages/ExpedientesSecundarios';
import Empresas from './pages/Empresas';
import Peticionarios from './pages/Peticionarios';
import Clasificaciones from './pages/Clasificaciones';
import EstadosExpedientes from './pages/EstadosExpedientes';
import Departamentos from './pages/Departamentos';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Asegúrate de que la ruta es correcta
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clasificaciones" element={
            <ProtectedRoute>
              <Clasificaciones />
            </ProtectedRoute>
          } />
          <Route path="/estados-expedientes" element={
            <ProtectedRoute>
              <EstadosExpedientes />
            </ProtectedRoute>
          } />
          <Route path="/departamentos" element={
            <ProtectedRoute>
              <Departamentos />
            </ProtectedRoute>
          } />
          <Route path="/peticionarios" element={
            <ProtectedRoute>
              <Peticionarios />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/empresas" element={
            <ProtectedRoute>
              <Empresas />
            </ProtectedRoute>
          } />
          <Route path="/expedientes-secundarios" element={
            <ProtectedRoute>
              <ExpedientesSecundarios />
            </ProtectedRoute>
          } />
          <Route path="/expedientes-principales" element={
            <ProtectedRoute>
              <ExpedientesPrincipales />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;