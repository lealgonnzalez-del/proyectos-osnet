import React from 'react';

function BotonAlerta() {
  const mostrarAlerta = () => {
    alert('¡Has hecho clic en el botón!');
  };

  return (
    <div>
      <h2>Botón de Alerta</h2>
      <button onClick={mostrarAlerta}>Haz clic aquí</button>
    </div>
  );
}

export default BotonAlerta;