import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import api from "../services/api";

function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const iniciarSesion = async () => {
    console.log("CLICK FUNCIONA");

    // ✅ Validación básica
    if (usuario.trim() === "" || password.trim() === "") {
      alert("Ingrese usuario y contraseña");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username: usuario,
        password: password,
      });

      console.log("RESPUESTA LOGIN:", res.data);

      // 🟡 CASO 1: MFA requerido
      if (res.data.mfaRequired) {
        navigate("/qr", {
          state: { userId: res.data.userId }
        });
        return;
      }

      // 🟢 CASO 2: Login normal
      if (res.data.access_token) {

        // guardar token
        localStorage.setItem("token", res.data.access_token);

        // guardar usuario (opcional)
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        alert("Login exitoso");

        // 🔥 CORRECCIÓN AQUÍ (tenías un typo)
        navigate("/clientes");
      }

    } catch (error) {
      console.error("ERROR COMPLETO:", error);

      if (error.response) {
        console.log("DATA:", error.response.data);
        console.log("STATUS:", error.response.status);

        if (error.response.status === 401) {
          alert("Usuario o contraseña incorrectos");
        } else if (error.response.status === 500) {
          alert("Error interno del servidor");
        } else {
          alert("Error: " + (error.response.data?.message || "Error desconocido"));
        }

      } else if (error.request) {
        alert("No hay conexión con el backend");
      } else {
        alert("Error inesperado");
      }
    }
  };

  const limpiar = () => {
    setUsuario("");
    setPassword("");
  };

  return (
    <div className="container">

      <h1 className="title">Inicio de Sesión</h1>

      <input
        className="input"
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <div className="passwordContainer">

        <input
          className="input"
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="ojo"
          onClick={() => setMostrarPassword(!mostrarPassword)}
          style={{ cursor: "pointer" }}
        >
          👁
        </span>

      </div>

      <div className="buttons">

        <button className="button" onClick={iniciarSesion}>
          Iniciar Sesión
        </button>

        <button className="clearButton" onClick={limpiar}>
          Limpiar
        </button>

      </div>

    </div>
  );
}

export default Login;