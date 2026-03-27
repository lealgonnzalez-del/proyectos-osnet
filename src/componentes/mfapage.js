import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from '../imagenes/osnet.png';

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
        navigate("/clientes"); // Acceso concedido a las gráficas unificadas
      } else {
        alert(data.message || "Código incorrecto");
      }
    } catch (error) {
      alert("Error al verificar el código");
    }
  };

  return (
    <div className="container-auth">
      
      {/* SECCIÓN DEL CÓDIGO (Siempre visible) */}
      <div style={{ marginBottom: '30px' }}>
        <input
          className="input-osnet"
          type="text"
          placeholder="Ingrese codigo"
          value={codigo}
          maxLength={6}
          style={{ textAlign: 'center', fontSize: '18px' }}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
        />
        <button 
          className="btn-osnet btn-primary-osnet" 
          onClick={verificarCodigo} 
          style={{ marginTop: '15px', width: '100%' }}
        >
          Confirmar Código
        </button>
      </div>

      {/* MODAL DEL QR (Solo si es primera vez) */}
      {isFirstTime && qrCodeUrl && (
        <div className="qr-modal">
          <h2 className="qr-title-modal">Escanea con Google Authenticator</h2>
          
          <div className="qr-image-wrapper">
            <img src={qrCodeUrl} alt="QR Setup" style={{ width: '200px' }} />
          </div>
          
          <div>
            <button 
              className="btn-qr-close" 
              onClick={() => navigate("/")}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {!isFirstTime && (
        <button 
          className="btn-osnet btn-secondary-osnet" 
          style={{ background: 'transparent', color: 'white' }} 
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      )}

      <img src={logo} alt="Logo OSNET" className="logo-osnet-bottom" />
    </div>
  );
}

export default MfaPage;