import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login(){

  const [usuario,setUsuario] = useState("");
  const [password,setPassword] = useState("");
  const [mostrarPassword,setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const iniciarSesion = () => {

    if(usuario === "" || password === ""){
      alert("Ingrese usuario y contraseña");
      return;
    }

    navigate("/clientes"); // ahora entra directo
  };

  const limpiar = () =>{
    setUsuario("");
    setPassword("");
  };

  return(

    <div className="container">

      <h1 className="title">Inicio de Sesión</h1>

      <input
        className="input"
        placeholder="Usuario"
        value={usuario}
        onChange={(e)=>setUsuario(e.target.value)}
      />

      <div className="passwordContainer">

        <input
          className="input"
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <span
          className="ojo"
          onClick={()=>setMostrarPassword(!mostrarPassword)}
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

      <img
        src={require("../imagenes/osnet.png")}
        className="osnet"
        alt="logo"
      />

    </div>

  );

}

export default Login;