import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from '../imagenes/osnet.png';

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const [verificando, setVerificando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, qrCodeUrl, tempToken, isFirstTime } = location.state || {};
  
  
  const [mostrarQR] = useState(isFirstTime);

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
          'Authorization': `Bearer ${tempToken}` 
        },
        body: JSON.stringify({ 
          userId: userId, 
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
      <div className="form-auth" style={{ width: '100%', maxWidth: '320px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
          Ingresa el codigo enviado a tu correo electronico
        </p>
        
        <input
          className="input-osnet"
          type="text"
          placeholder="000000"
          value={codigo}
          maxLength={6}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
          style={{ 
            textAlign: 'center', 
            fontSize: '20px', 
            letterSpacing: '8px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'block',
            marginBottom: '0' 
          }}
        />
        
        <button 
          className="btn-osnet btn-primary-osnet" 
          onClick={verificarCodigo}
          disabled={verificando}
          style={{ 
            marginTop: '20px', 
            width: '100%',
            boxSizing: 'border-box',
            marginLeft: '0'
          }}
        >
          {verificando ? 'Verificando...' : 'Confirmar Código'}
        </button>

        
        {isFirstTime && qrCodeUrl && mostrarQR && (
          
          <div style={{ 
            marginTop: '30px',      
            marginBottom: '30px',   
            width: '100%',          
            display: 'flex',        
            flexDirection: 'column',
            alignItems: 'center',    
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#333',         
              fontSize: '13px', 
              marginBottom: '15px', 
              width: '90%',          
              lineHeight: '1.4'      
            }}>
              Abre Google Authenticator o Microsoft Authenticator y escanea:
            </p>
            
            
            <div style={{ 
              backgroundColor: '#fff', 
              padding: '10px',        
              borderRadius: '8px',    
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
            }}>
              <img src={qrCodeUrl} alt="QR Setup" style={{ 
                width: '180px', 
                height: '180px',      
                display: 'block'      
              }} />
            </div>
          </div>
        )}
        

      </div>

      <img src={logo} alt="Logo OSNET" className="logo-osnet-bottom" style={{ display: 'block', margin: '10px auto 30px', width: '120px' }} />
    </div>
  );
}

export default MfaPage;