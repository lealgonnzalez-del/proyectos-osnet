import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Intentar obtener datos del state o del almacenamiento local
  const userId = location.state?.userId || localStorage.getItem("temp_userId");
  const qrCodeUrl = location.state?.qrCodeUrl || localStorage.getItem("temp_qrCode");
  const isFirstTime = location.state?.firstTime || !!qrCodeUrl;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      // Guardar temporalmente por si refresca la página
      localStorage.setItem("temp_userId", userId);
      if (qrCodeUrl) localStorage.setItem("temp_qrCode", qrCodeUrl);
    }
  }, [userId, navigate, qrCodeUrl]);

  const verificarCodigo = async () => {
    try {
      const res = await fetch('http://localhost:3002/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mfaCode: codigo }),
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        // Limpiar temporales
        localStorage.removeItem("temp_userId");
        localStorage.removeItem("temp_qrCode");
        navigate("/clientes");
      } else {
        alert("Código inválido");
      }
    } catch (error) {
      alert("Error al verificar");
    }
  };

  return (
    <div className="container">
      <h2>Verificación MFA</h2>
      {isFirstTime && qrCodeUrl && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>Vincula tu cuenta escaneando este QR:</p>
          <img src={qrCodeUrl} alt="QR" style={{ border: '5px solid white' }} />
        </div>
      )}
      <input
        className="input"
        type="text"
        placeholder="Ingrese código de 6 dígitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button className="button" onClick={verificarCodigo} style={{ marginTop: '20px' }}>
        Confirmar
      </button>
    </div>
  );
}

export default MfaPage;