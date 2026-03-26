import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function QRPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');

  // Corregido: Eliminamos 'firstTime' para limpiar el Warning de ESLint
  const { userId, qrCodeUrl } = location.state || {};

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const verificarCodigo = async () => {
    if (codigo.length < 6) {
      alert("Ingrese el código de 6 dígitos");
      return;
    }

    try {
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
        alert('Código incorrecto o expirado');
      }
    } catch (error) {
      console.error("Error verificando MFA:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="container">
      <h2 className="qr-title">Seguridad MFA</h2>
      
      {/* Solo se muestra si tenemos la URL del QR */}
      {qrCodeUrl && (
        <div className="qr-container">
          <p style={{ color: 'white', fontSize: '14px' }}>Escanea este código con tu celular:</p>
          <img 
            src={qrCodeUrl} 
            alt="QR" 
            className="qr-img" 
            style={{ background: 'white', padding: '10px', marginTop: '10px' }} 
          />
        </div>
      )}

      <div className="qr-form" style={{ marginTop: '20px' }}>
        <input
          className="qr-input"
          placeholder="Código de 6 dígitos"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          maxLength={6}
        />
        <button className="qr-button" onClick={verificarCodigo}>
          Verificar e Ingresar
        </button>
      </div>
    </div>
  );
}

export default QRPage;