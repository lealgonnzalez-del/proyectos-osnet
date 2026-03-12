import React, { useState, useEffect } from 'react';

function Temporizador() {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Temporizador: {} segundos</h2>
    </div>
  );
}

export default Temporizador;