import { QRCodeCanvas } from "qrcode.react";

function QRUsuario({ usuario }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <QRCodeCanvas value={usuario} size={200} />
    </div>
  );
}

export default QRUsuario;