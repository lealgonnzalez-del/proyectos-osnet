import React, { useState } from 'react';

function BotonLogin() {
  const [logueado, setLogueado] = useState(false);

  const manejarLogin = () => {
    setLogueado(!logueado); // Alterna estado entre logueado/no logueado
  };

  return (
    <div>
      <h2>Inicio de Sesión</h2>
      <button onClick={manejarLogin}>
        {logueado ? 'Cerrar Sesión' : 'Iniciar Sesión'}
      </button>
      {logueado && <p style={{ color: 'green', marginTop: '10px' }}>¡Has iniciado sesión!</p>}
    </div>
  );
}

export default BotonLogin;