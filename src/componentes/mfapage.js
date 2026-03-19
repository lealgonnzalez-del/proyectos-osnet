import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Obtener datos desde state o localStorage (fallback)
  const userId =
    location.state?.userId || localStorage.getItem("mfa_user");

  const qrCodeUrl =
    location.state?.qrCodeUrl || localStorage.getItem("mfa_qr");

  const firstTime =
    location.state?.firstTime ??
    localStorage.getItem("mfa_firstTime") === "true";

  // 🚫 Protección: si no hay userId → volver a login
  useEffect(() => {
    if (!userId) {
      alert("Sesión inválida, inicia sesión nuevamente");
      navigate("/login");
    }
  }, [userId, navigate]);

  const verificarCodigo = async () => {
    if (codigo.trim() === "") {
      alert("Ingrese el código MFA");
      return;
    }

    try {
      const res = await api.post("/auth/mfa/verify", {
        userId: userId,
        mfaCode: codigo,
      });

      console.log("MFA OK:", res.data);

      // 🔐 Guardar token SOLO después del MFA
      localStorage.setItem("token", res.data.access_token);

      // 🧹 Limpiar datos temporales
      localStorage.removeItem("mfa_user");
      localStorage.removeItem("mfa_qr");
      localStorage.removeItem("mfa_firstTime");

      alert("Autenticación completa");

      // 🚀 Redirigir
      navigate("/clientes");

    } catch (error) {
      console.error("Error MFA:", error);

      if (error.response?.status === 401) {
        alert("Código incorrecto");
      } else {
        alert("Error verificando MFA");
      }
    }
  };

  return (
    <div className="container">
      <h2>Verificación MFA</h2>

      {/* 🔥 Mostrar QR solo si es primer login */}
      {firstTime && qrCodeUrl ? (
        <div style={{ marginBottom: "20px" }}>
          <p>Escanea este código con Microsoft Authenticator</p>
          <img src={qrCodeUrl} alt="QR MFA" />
        </div>
      ) : (
        <p>Ingresa el código de tu aplicación autenticadora</p>
      )}

      <input
        className="input"
        type="text"
        placeholder="Código de 6 dígitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      <br /><br />

      <button className="button" onClick={verificarCodigo}>
        Verificar
      </button>
    </div>
  );
}

export default MfaPage;