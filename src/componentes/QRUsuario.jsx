import { QRCodeCanvas } from "qrcode.react";


function QRUsuario({ usuario }) {
  return (
    <div className="qr-overlay-container">
      <div className="qr-card">

        <h2>QR de Usuario</h2>

        <div className="qr-box">

          {/* 🔥 QR GENERADO */}
          <div className="qr-wrapper">
            <QRCodeCanvas
              value={usuario}
              size={200}
              includeMargin={true}
              className="qr-img-canvas"
            />
          </div>

          {/* 🔥 CAPA SOBREPUESTA */}
          <div className="qr-overlay"></div>

        </div>

      </div>
    </div>
  );
}

export default QRUsuario;