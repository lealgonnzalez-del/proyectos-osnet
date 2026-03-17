import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function MfaPage() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

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

      // guardar token
      localStorage.setItem("token", res.data.access_token);

      alert("Autenticación completa");

      navigate("/qr");

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

      <input
        className="input"
        type="text"
        placeholder="Código de 6 dígitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      <button className="button" onClick={verificarCodigo}>
        Verificar
      </button>
    </div>
  );
}

export default MfaPage;