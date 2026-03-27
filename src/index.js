import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./componentes/Login";
import MfaPage from "./componentes/mfapage"; // Asegúrate que el nombre coincida
import Clientes from "./componentes/Clientes";

// Componente para proteger la ruta de Clientes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/mfa" element={<MfaPage />} />
      <Route 
        path="/clientes" 
        element={
          <PrivateRoute>
            <Clientes />
          </PrivateRoute>
        } 
      />
      {/* Redirige cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);