import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../imagenes/osnet.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // CASO 1: Primera vez (Generar QR)
      if (data.access_token) {
        const qrRes = await fetch('http://localhost:3002/auth/mfa/generate', {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });
        const qrData = await qrRes.json();

        navigate('/mfa', { 
          state: { 
            userId: data.user.id, 
            qrCodeUrl: qrData.qrCodeUrl, 
            isFirstTime: true,
            
          } 
        });
        return;
      }

      // CASO 2: Ya configurado (Solo pedir código)
      if (data.mfaRequired) {
        navigate('/mfa', { 
          state: { 
            userId: data.userId, 
            isFirstTime: false 
          } 
        });
        return;
      }

      // CASO 3: Login directo (MFA desactivado)
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/clientes');
      } else {
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-auth">
      <h2 className="auth-title">Inicio de Sesión</h2>
      
      <form onSubmit={handleLogin} className="form-auth">
        <input
          className="input-osnet"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <div className="password-wrapper">
          <input
            className="input-osnet input-password-osnet"
            type={mostrarPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={() => setMostrarPassword(!mostrarPassword)}>
            {mostrarPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        <div className="auth-buttons">
          <button type="submit" className="btn-osnet btn-primary-osnet" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          <button
            type="button"
            className="limpiar"
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