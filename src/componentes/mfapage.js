import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from '../imagenes/osnet.png';

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Obtenemos los datos enviados desde el Login
  const { userId, qrCodeUrl, isFirstTime } = location.state || {};

  useEffect(() => {
    if (!userId) {
      navigate("/");
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

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/clientes"); 
      } else {
        alert(data.message || "Código incorrecto");
      }
    } catch (error) {
      alert("Error al verificar el código");
    }
  };

  return (
    <div className="container-auth">
      <div className="form-auth">
        <h2 className="auth-title">Ingresar Codigo</h2>
        
        <input
          className="input-osnet input-mfa"
          type="text"
          placeholder="000000"
          value={codigo}
          maxLength={6}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
          style={{ textAlign: 'center', fontSize: '15px', letterSpacing: '8px' }}
        />
        
        <button 
          className="btn-osnet btn-primary-osnet" 
          onClick={verificarCodigo}
          style={{ marginTop: '5px', width: '50%' }}
        >
          Confirmar Código
        </button>

        {!isFirstTime && (
          <button 
            className="btn-osnet" 
            style={{ background: 'transparent', marginTop: '10px', fontSize: '14px' }} 
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        )}
      </div>

      {isFirstTime && qrCodeUrl && (
        <div className="qr-modal-overlay">
          <div className="qr-modal">
            <h2 className="qr-title-modal">Configura tu Doble Factor</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Escanea este código con Google Authenticator
            </p>
            <div className="qr-image-wrapper">
              <img src={qrCodeUrl} alt="QR Setup" style={{ width: '180px' }} />
            </div>
            <button className="btn-qr-close" onClick={() => navigate(0)}>
              Ya lo escaneé
            </button>
          </div>
        </div>
      )}

      <img src={logo} alt="Logo OSNET" className="logo-osnet-bottom" />
    </div>
  );
}

export default MfaPage;