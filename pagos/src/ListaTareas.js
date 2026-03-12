import React, { useState } from 'react';

function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState('');

  const agregarTarea = () => {
    if(input.trim() !== '') {
      setTareas([...tareas, input]);
      setInput('');
    }
  };

  return (
    <div>
      <h2>Lista de Tareas</h2>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Escribe una tarea"
      />
      <button onClick={agregarTarea}>Agregar</button>
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index}>{tarea}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;