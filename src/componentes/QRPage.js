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
  const qrCodeUrl = localStorage.getItem("qr");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    if (qrCodeUrl) {
      setQr(qrCodeUrl);
    } else {
      setQr(null);
    }
  }, [userId, qrCodeUrl, navigate]);

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
          {qr ? "Escanea el QR" : "Ingresa tu código de verificación"}
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

      {/* 🔥 LOGO CORRECTO */}
      <img 
        src={osnetLogo}
        alt="OSNET"
        className="osnet"
      />
    </>
  );
}

export default QRPage;