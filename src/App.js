import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRUsuario from "./componentes/QRUsuario";

function QRPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const usuario = location.state?.usuario;

  const secreto = Math.random().toString(36).substring(2,18);

  const otpURL =
  `otpauth://totp/MiSistema:${usuario}?secret=${secreto}&issuer=MiSistema`;

  const entrarSistema = () => {
    navigate("/clientes");
  };

  return (

    <div className="container">

      <h2>Escanea el QR</h2>

      <QRUsuario usuario={otpURL}/>

      <button className="button" onClick={entrarSistema}>
        Continuar
      </button>

    </div>

  );

}

export default QRPage;