import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function QRPage() {
  const [qr, setQr] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  // 🔐 Generar QR automáticamente
  useEffect(() => {
    const generarQR = async () => {
      try {
        const res = await api.get("/auth/mfa/generate", {
          params: { userId }
        });

        console.log("QR DATA:", res.data);

        // 🔥 SOPORTA TODOS LOS FORMATOS DE BACKEND
        const qrRaw =
          res.data.qr ||
          res.data.qrCode ||
          res.data.data?.data || // 👈 TU CASO
          res.data.data;

        if (qrRaw) {
          const qrBase64 = qrRaw.startsWith("data:image")
            ? qrRaw
            : `data:image/png;base64,${qrRaw}`;

          setQr(qrBase64);
        } else {
          setError("El backend no envió un QR válido");
        }

      } catch (error) {
        console.error("Error generando QR:", error);
        setError("No se pudo generar el QR");
      }
    };

    if (userId) {
      generarQR();
    }
  }, [userId]);

  // 🔐 Verificar código MFA
  const verificarCodigo = async () => {
    if (codigo.trim() === "") {
      setError("Ingrese el código MFA");
      return;
    }

    try {
      const res = await api.post("/auth/mfa/verify", {
        userId,
        mfaCode: codigo,
      });

      console.log("MFA OK:", res.data);

      localStorage.setItem("token", res.data.access_token);

      alert("Autenticación completa");

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

  // ❌ Si no hay userId
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

      {/* QR */}
      {qr ? (
        <img src={qr} alt="QR MFA" />
      ) : (
        <p>Cargando QR...</p>
      )}

      {/* Input código */}
      <input
        type="text"
        placeholder="Código de 6 dígitos"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Botón */}
      <button onClick={verificarCodigo}>
        Verificar
      </button>
    </div>
  );
}

export default QRPage;