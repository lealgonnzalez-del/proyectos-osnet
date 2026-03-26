import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../imagenes/osnet.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.mfaRequired) {
      navigate('/qr', { state: data });
      return;
    }

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      navigate('/clientes');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Inicio de Secion</h2>

      <form onSubmit={handleLogin}>
        <input
          className="input"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="passwordContainer">
          <input
            className="input"
            type={mostrarPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="ojo"
            onClick={() => setMostrarPassword(!mostrarPassword)}
          >
            👁
          </span>
        </div>

        <div className="buttons">
          <button className="button">Ingresar</button>

          <button
            type="button"
            className="clearButton"
            onClick={() => {
              setUsername('');
              setPassword('');
            }}
          >
            Limpiar
          </button>
        </div>
      </form>
      <img src={logo} alt="Logo" className="logoOsnet" />
    </div>
  );
}

export default Login;