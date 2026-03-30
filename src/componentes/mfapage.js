import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from '../imagenes/osnet.png';

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const [verificando, setVerificando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Recuperamos tempToken que viene del Login
  const { userId, qrCodeUrl, tempToken, isFirstTime } = location.state || {};
  
  // 2. Controlamos el modal con un estado de React en lugar de document.querySelector
  const [mostrarModal, setMostrarModal] = useState(isFirstTime);

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

    setVerificando(true);
    try {
      const res = await fetch('http://localhost:3002/auth/mfa/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // AJUSTE A: Enviamos el token temporal para autorizar la petición
          'Authorization': `Bearer ${tempToken}` 
        },
        body: JSON.stringify({ 
          userId: userId, 
          // AJUSTE B: Asegúrate que el backend espere 'mfaCode' o 'twoFactorAuthenticationCode'
          mfaCode: codigo 
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/clientes"); 
      } else {
        alert(data.message || "Código incorrecto o expirado");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="container-auth">
      <div className="form-auth">
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
          {isFirstTime 
            ? "Escanea el código QR y luego ingresa el código de tu App." 
            : "Ingresa el código de 6 dígitos de tu aplicación Authenticator."}
        </p>
        
        <input
          className="input-osnet"
          type="text"
          placeholder="000000"
          value={codigo}
          maxLength={6}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
          style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
        />
        
        <button 
          className="btn-osnet btn-primary-osnet" 
          onClick={verificarCodigo}
          disabled={verificando}
          style={{ marginTop: '20px' }}
        >
          {verificando ? 'Verificando...' : 'Confirmar Código'}
        </button>

        <button 
          className="btn-osnet btn-secondary-osnet" 
          style={{ marginTop: '10px' }} 
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>

      
      {isFirstTime && qrCodeUrl && mostrarModal && (
        <div className="qr-modal-overlay">
          <div className="qr-modal">
            <h2 className="qr-title-modal">Configurar Doble Factor</h2>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
              Abre Google Authenticator o Microsoft Authenticator y escanea:
            </p>
            <div className="qr-image-wrapper">
              <img src={qrCodeUrl} alt="QR Setup" style={{ width: '180px' }} />
            </div>
            <p style={{ color: '#888', fontSize: '11px', marginTop: '10px' }}>
              Una vez escaneado, cierra esta ventana e ingresa el código.
            </p>
            <button className="btn-qr-close" onClick={() => setMostrarModal(false)}>
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