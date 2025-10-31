import React, { useState } from 'react';

export default function TramiteForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipo, setTipo] = useState('normal');
  const [mensaje, setMensaje] = useState('');

  const handleAgregar = async e => {
    e.preventDefault();
    try{
      const res = await fetch('http://127.0.0.1:5000/tramite',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({nombre, correo, tipo_tramite:tipo})
      });
      const data = await res.json();
      setMensaje(data.mensaje);
    } catch(err){
      setMensaje(`Error: ${err.message}`);
    }
  }

  return (
    <div style={{padding:'20px'}}>
      <h2>Agregar Trámite (Admin)</h2>
      <form onSubmit={handleAgregar}>
        <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} required /><br/>
        <input placeholder="Correo" value={correo} onChange={e=>setCorreo(e.target.value)} required /><br/>
        <input placeholder="Tipo de trámite" value={tipo} onChange={e=>setTipo(e.target.value)} required /><br/>
        <button type="submit">Agregar Trámite</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}
