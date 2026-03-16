import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRUsuario from "./QRUsuario";
import "../App.css";

function QRPage(){

  const location = useLocation();
  const navigate = useNavigate();

  const usuario = location.state?.usuario || "usuario";

  const secreto = Math.random().toString(36).substring(2,18);

  const otpURL =
  `otpauth://totp/MiSistema:${usuario}?secret=${secreto}&issuer=MiSistema`;

  // FUNCION BOTON CERRAR
  const cerrarModal = () => {
    navigate("/");   // vuelve al login
  };

  return(

    <div className="modal">

      <div className="modal-content">

        <input placeholder="Ingrese codigo"/>

        <h3>Escanea QR</h3>

        <QRUsuario usuario={otpURL}/>

        <button onClick={cerrarModal}>
          Cerrar
        </button>

      </div>

    </div>

  );

}

export default QRPage;