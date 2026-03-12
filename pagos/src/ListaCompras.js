import React, { useState } from 'react';

function ListaCompras() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const agregarItem = () => {
    if(input.trim() !== '') {
      setItems([...items, input]);
      setInput('');
    }
  };

  const eliminarItem = (index) => {
    const nuevaLista = items.filter((_, i) => i !== index);
    setItems(nuevaLista);
  };

  return (
    <div>
      <h2>Lista de Compras</h2>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Agrega un artículo"
      />
      <button onClick={agregarItem}>Agregar</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item} 
            <button onClick={() => eliminarItem(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaCompras;