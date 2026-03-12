import React from 'react';
import './App.css';
import HolaMundo from './HolaMundo';
import Contador from './Contador';
import ListaTareas from './ListaTareas';
import BotonAlerta from './BotonAlerta';
import Temporizador from './Temporizador';
import ListaCompras from './ListaCompras';
import BotonLogin from './BotonLogin';

function App() {
  return (
    <div className="App">
      <h1>Proyecto de Práctica React Ampliado ✅</h1>
      <hr />
      <HolaMundo />
      <hr />
      <Contador />
      <hr />
      <ListaTareas />
      <hr />
      <BotonAlerta />
      <hr />
      <Temporizador />
      <hr />
      <ListaCompras />
      <hr />
      <BotonLogin />
    </div>
  );
}

export default App;