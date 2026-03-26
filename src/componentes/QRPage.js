import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function QRPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, qrCodeUrl, firstTime } = location.state || {};
  const [codigo, setCodigo] = useState('');

  const verificarCodigo = async () => {
    const res = await fetch('http://localhost:3002/auth/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mfaCode: codigo }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      navigate('/clientes');
    } else {
      alert('Código incorrecto');
    }
  };

  return (
    <div className="container">
      <h2 className="qr-title">Ingresar Codigo</h2>

      {firstTime && qrCodeUrl && (
        <div className="qr-container">
          <img src={qrCodeUrl} alt="QR" className="qr-img" />
        </div>
      )}

      <div className="qr-form">
        <input
          className="qr-input"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <button className="qr-button" onClick={verificarCodigo}>
          Verificar
        </button>
      </div>
    </div>
  );
}

export default QRPage;