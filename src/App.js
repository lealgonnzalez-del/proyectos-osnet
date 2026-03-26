import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './componentes/Login';
import QRPage from './componentes/QRPage';
import Clientes from './componentes/Clientes';
import logo from '../imagenes/logo.png';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}

export default App;