import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function QRPage() {
  const [qr, setQr] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const userId =
    location.state?.userId || localStorage.getItem("mfa_user");

  const qrCodeUrl = location.state?.qrCodeUrl;

  useEffect(() => {
    console.log("STATE:", location.state);

    if (qrCodeUrl) {
      setQr(qrCodeUrl);
    } else {
      setError("No se recibió el QR desde el login");
    }
  }, [qrCodeUrl, location.state]);

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

      console.log("MFA OK:", res.data);

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.removeItem("mfa_user");
      }

      alert("Login completo");
      navigate("/clientes");

    } catch (error) {
      console.error("Error MFA:", error);

      if (error.response?.status === 401) {
        setError("Código incorrecto");
      } else {
        setError("Error verificando MFA");
      }
    }
  };

  if (!userId) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error: acceso inválido</h2>
        <button onClick={() => navigate("/")}>
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Escanea el QR</h2>

      <div className="qr-container">
        {qr ? (
          <img
            src={qr}
            alt="QR MFA"
            style={{ width: "250px" }}
          />
        ) : (
          <p>{error || "Cargando QR..."}</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Código de 6 dígitos"
        maxLength={6}
        value={codigo}
        onChange={(e) =>
          setCodigo(e.target.value.replace(/\D/g, ""))
        }
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={verificarCodigo}>
        Verificar
      </button>
    </div>
  );
}

export default QRPage;