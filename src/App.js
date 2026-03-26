import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import QRPage from './componentes/QRPage';
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
        <Route path="/qr" element={<QRPage />} />
        <Route 
          path="/clientes" 
          element={<PrivateRoute><Clientes /></PrivateRoute>} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;