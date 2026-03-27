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

    try {
      const res = await fetch('http://localhost:3002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // CASO 1: Es la primera vez (Requiere generar QR)
      if (data.tempToken) {
        const qrRes = await fetch('http://localhost:3002/auth/mfa/generate', {
          headers: { Authorization: `Bearer ${data.tempToken}` }
        });
        const qrData = await qrRes.json();

        navigate('/mfa', { 
          state: { 
            userId: data.userId, 
            qrCodeUrl: qrData.qrCodeUrl, 
            isFirstTime: true 
          } 
        });
        return;
      }

      // CASO 2: Ya está vinculado (MfaPage unificada)
      if (data.mfaRequired) {
        navigate('/mfa', { state: { userId: data.userId, isFirstTime: false } });
        return;
      }

      // CASO 3: Login directo
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/clientes');
      } else {
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container-auth">
      <h2 className="auth-title">Inicio de Sesión</h2>
      
      <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
        <input
          className="input-osnet"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <div className="password-wrapper">
          <input
            className="input-osnet"
            type={mostrarPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={() => setMostrarPassword(!mostrarPassword)}>
            {mostrarPassword ? '🙈' : '👁'}
          </span>
        </div>

        <div className="auth-buttons">
          <button type="submit" className="btn-osnet btn-primary-osnet">Iniciar Sesión</button>
          <button
            type="button"
            className="btn-osnet btn-secondary-osnet"
            onClick={() => { setUsername(''); setPassword(''); }}
          >
            Limpiar
          </button>
        </div>
      </form>
      
      <img src={logo} alt="Logo OSNET" className="logo-osnet-bottom" />
    </div>
  );
}

export default Login;