import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import osnetLogo from "../imagenes/osnet.png";

function QRPage() {
  const [qr, setQr] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const userId = localStorage.getItem("mfa_user");

  // 🔥 FUNCIÓN PARA OBTENER QR SOLO SI NO EXISTE
  const getQR = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/mfa/generate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQr(res.data.qrCodeUrl);

      // 🔥 GUARDAR SOLO UNA VEZ
      localStorage.setItem("qr", res.data.qrCodeUrl);

    } catch (err) {
      console.error("Error obteniendo QR:", err);
      setError("No se pudo generar el QR");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const savedQR = localStorage.getItem("qr");

    if (savedQR) {
      // ✅ USAR QR EXISTENTE
      setQr(savedQR);
    } else {
      // 🔥 SOLO SI NO EXISTE → GENERAR
      getQR();
    }

  }, [userId, navigate]);

  const verificarCodigo = async () => {
    setError("");

    if (codigo.length !== 6) {
      setError("Ingrese código de 6 dígitos");
      return;
    }

    try {
      const res = await api.post("/auth/mfa/verify", {
        userId,
        mfaCode: codigo,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }

      // 🔥 LIMPIAR SOLO DESPUÉS DE LOGIN COMPLETO
      localStorage.removeItem("mfa_user");
      localStorage.removeItem("qr");

      alert("Login completo");
      navigate("/clientes");

    } catch (error) {
      if (error.response?.status === 401) {
        setError("Código incorrecto");
      } else {
        setError("Error verificando MFA");
      }
    }
  };

  return (
    <>
      <div className="container">

        <h2 className="qr-title">
          {qr ? "Escanea el QR" : "Cargando QR..."}
        </h2>

        <div className="qr-line"></div>

        <div className="qr-container">
          {qr && (
            <img
              src={qr}
              alt="QR MFA"
              className="qr-img"
            />
          )}
        </div>

        <div className="qr-form">
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            maxLength={6}
            value={codigo}
            className="qr-input"
            onChange={(e) =>
              setCodigo(e.target.value.replace(/\D/g, ""))
            }
          />

          <button
            className="qr-button"
            onClick={verificarCodigo}
          >
            Verificar
          </button>

        </div>

        {error && <p className="qr-error">{error}</p>}

      </div>

      <img 
        src={osnetLogo}
        alt="OSNET"
        className="osnet"
      />
    </>
  );
}

export default QRPage;