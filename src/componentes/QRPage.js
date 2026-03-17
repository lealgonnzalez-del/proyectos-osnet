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
  // Extraemos el token para las peticiones seguras
  const token = localStorage.getItem("token");

  // 🔐 Generar QR automáticamente
  useEffect(() => {
    const generarQR = async () => {
      try {
        setError(""); // Limpiar errores previos
        const res = await api.get("/auth/mfa/generate", {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` } // 👈 Vital para evitar el 401
        });

        console.log("QR DATA:", res.data);

        // Intentar extraer el string del QR de diferentes estructuras posibles
        const qrRaw = res.data?.qr || res.data?.qrCode || res.data?.data || res.data;

        if (qrRaw) {
          // Si el backend envía el string 'otpauth://', se debería usar qrcode.react
          // Si envía la imagen base64, se procesa así:
          const qrBase64 = qrRaw.startsWith("data:image")
            ? qrRaw
            : `data:image/png;base64,${qrRaw}`;

          setQr(qrBase64);
        } else {
          setError("El backend no envió un QR válido");
        }

      } catch (error) {
        console.error("Error generando QR:", error);
        if (error.response?.status === 401) {
          setError("Sesión no autorizada o expirada");
        } else {
          setError("No se pudo conectar con el servidor para generar el QR");
        }
      }
    };

    if (userId) {
      generarQR();
    }
  }, [userId, token]);

  // 🔐 Verificar código MFA
  const verificarCodigo = async () => {
    setError(""); // Limpiar errores antes de intentar

    if (codigo.trim().length < 6) {
      setError("Ingrese el código completo de 6 dígitos");
      return;
    }

    try {
      const res = await api.post("/auth/mfa/verify", {
        userId,
        mfaCode: codigo,
      }, {
        headers: { Authorization: `Bearer ${token}` } // 👈 También necesario aquí
      });

      console.log("MFA OK:", res.data);

      // Si el backend devuelve un nuevo token tras el MFA, lo actualizamos
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }

      alert("Autenticación completa");
      navigate("/clientes");

    } catch (error) {
      console.error("Error MFA:", error);
      const mensajeError = error.response?.data?.message || "Error verificando MFA";
      setError(error.response?.status === 401 ? "Código incorrecto" : mensajeError);
    }
  };

  // ❌ Si no hay userId o no hay acceso
  if (!userId) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error: acceso inválido</h2>
        <button onClick={() => navigate("/")}>Volver al login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Escanea el QR</h2>

      <div className="qr-container">
        {qr ? (
          <img src={qr} alt="QR MFA" style={{ width: "250px", height: "250px" }} />
        ) : (
          <p>{error ? "Error al cargar" : "Cargando QR..."}</p>
        )}
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Código de 6 dígitos"
          maxLength={6}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} // Solo números
        />

        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}

        <button onClick={verificarCodigo} className="btn-verify">
          Verificar
        </button>
      </div>
    </div>
  );
}

export default QRPage;
