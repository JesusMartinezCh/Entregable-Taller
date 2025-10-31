import React, { useEffect, useState } from 'react';

export default function TramiteList() {
  const [tramites, setTramites] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/tramites')
      .then(res => res.json())
      .then(data => setTramites(data));
  }, []);

  return (
    <div style={{padding:'20px'}}>
      <h2>Todos los Trámites (Admin)</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ciudadano</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map(t=>(
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.ciudadano}</td>
              <td>{t.correo}</td>
              <td>{t.tipo_tramite}</td>
              <td>{t.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
