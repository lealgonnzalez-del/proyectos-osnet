import React, { useState } from 'react';
import './App.css';
import pago from "./imagenes/logo.png";
import { useNavigate } from "react-router-dom";


function App() {

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {

    if (usuario.trim() === '' || password.trim() === '') {
      alert('Por favor completa todos los campos');
      return;
    }

    navigate(`/usuario/${usuario}`);
  };

  const handleClear = () => {
    setUsuario('');
    setPassword('');
  };

  return (
    <div className="container">

      

      <h1 className="title">Inicio de Sesión</h1>

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="input"
      />

      <div className="passwordContainer">
        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <span
          className="ojo"
          onClick={() => setMostrarPassword(!mostrarPassword)}
        >
          👁
        </span>
      </div>
      <div className="buttons">
          <button className="button" onClick={handleLogin}>
            Iniciar Sesión
          </button>

          <button className="clearButton" onClick={handleClear}>
            Limpiar
          </button>
      </div>

      <div>
        <img src={pago} alt="logo" className="logo"/>
      </div>

    </div>
  );
}

export default App;