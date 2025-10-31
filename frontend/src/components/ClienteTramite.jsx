import React, { useState } from 'react';
// La importación directa solo aplica el CSS globalmente
import '../estilos/estilo.css'; 

export default function ClienteTramite() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [tramites, setTramites] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handleGenerar = async e => {
    e.preventDefault();
    setMensaje('');
    setTramites([]);

    try {
      const res = await fetch('http://127.0.0.1:5000/generar-tramite', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({nombre, correo})
      });
      const data = await res.json();
      if(res.ok){
        if(data.tramites.length === 0){
          setMensaje("No se encontraron trámites con esos datos.");
        } else {
          setTramites(data.tramites);
        }
      } else {
        setMensaje(data.error || "Error al consultar trámites.");
      }
    } catch(err){
      setMensaje(`Error: ${err.message}`);
    }
  }

  // Lógica para aplicar clases condicionales a los mensajes
  const isError = mensaje.startsWith('Error') || mensaje.includes('No se encontraron');
  const messageClass = isError ? 'errorMessage' : 'infoMessage'; 

  return (
    <div className="container"> 
      
      {/* 👈 NUEVA ESTRUCTURA PARA LA IMAGEN (ARRIBA Y CENTRADA) */}
      <div className="logo-header"> 
        <img 
          src="/senatip.png" 
          alt="Logo Senatip" 
          className="senatip-logo-top" // Nueva clase para el logo superior
        />
      </div>
      
      {/* El título ahora es simple */}
      <h2 className="title-top">Consultar Trámite</h2>
      
      <form onSubmit={handleGenerar} className="form">
        <input 
          type="text" 
          placeholder="Nombre" 
          value={nombre} 
          onChange={e=>setNombre(e.target.value)} 
          required 
          className="input" 
        />
        {/* ... el resto del formulario y tabla ... */}
      
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
          value={correo} 
          onChange={e=>setCorreo(e.target.value)} 
          required 
          className="input" 
        />
        <button 
          type="submit" 
          className="button" 
        >
          Consultar Trámites
        </button>
      </form>

      {mensaje && (
        <p className={`message ${messageClass}`}> 
          {mensaje}
        </p>
      )}

      {tramites.length>0 && (
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Solicitud</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map(t=>(
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.tipo_tramite}</td>
                  <td>{t.estado}</td>
                  <td>{t.fecha_solicitud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}