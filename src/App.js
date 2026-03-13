import React, { useState } from 'react';
import './App.css';
import pago from "./imagenes/osnet.png";
import QRUsuario from "./componentes/QRUsuario";
import usuariosSistema from "./usuarios.json";

function App() {

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [usuarioQR, setUsuarioQR] = useState(null);

  const handleLogin = () => {

    if (usuario.trim() === '' || password.trim() === '') {
      alert('Por favor completa todos los campos');
      return;
    }

    const usuarioValido = usuariosSistema.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!usuarioValido) {
      alert("Usuario o contraseña incorrecta");
      return;
    }

    const secreto = Math.random().toString(36).substring(2, 18);

    const otpURL = `otpauth://totp/MiSistema:${usuarioValido.usuario}?secret=${secreto}&issuer=MiSistema`;

    setUsuarioQR(otpURL); // genera QR
  };

  const handleClear = () => {
    setUsuario('');
    setPassword('');
    setUsuarioQR(null);
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
        <img src={pago} alt="osnet" className="osnet"/>
      </div>

      {usuarioQR && (
        <div className='modal'>
          <div className="modal-content">

            <QRUsuario usuario={usuarioQR}/>
            <button className="button" onClick={handleClear}>

            </button>

          </div>

        </div> 
      )}

    </div>
  );
}

export default App;