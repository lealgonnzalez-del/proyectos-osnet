import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import QRPage from './componentes/QRPage'; // <--- Asegúrate que este sea el que maneja el MFA
import Clientes from './componentes/Clientes';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* SOLUCIÓN: Añadimos la ruta que falta */}
        <Route path="/mfa" element={<QRPage />} /> 
        
        <Route path="/qr" element={<QRPage />} />
        <Route 
          path="/clientes" 
          element={<PrivateRoute><Clientes /></PrivateRoute>} 
        />
        {/* El comodín "*" redirige cualquier ruta inexistente al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;