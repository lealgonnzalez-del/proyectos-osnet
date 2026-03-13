import { QRCodeCanvas } from "qrcode.react";

function QRUsuario({ usuario }) {

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Escanea con Google Authenticator</h3>

      <QRCodeCanvas
        value={usuario}
        size={200}
      />
    </div>
  );
}

export default QRUsuario;