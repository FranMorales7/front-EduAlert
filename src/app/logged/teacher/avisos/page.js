'use client'; // si estás en Next.js App Router

import { useEffect, useState } from 'react';
import axios from 'axios';
import BlurBackground from '@/components/BlurBackground';
import api from '@/api/axios';

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     // Usamos la variable de entorno para la URL base
     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // Petición HTTP con Axios
    api
      .get(`${backendUrl}/incidents`)
      .then((response) => {
        setIncidents(response.data);   // guardamos los avisos.
        setLoading(false);         // dejamos de cargar
      })
      .catch((error) => {
        console.error('Error al traer los avisos.:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando avisos...</p>;

  return (
    <BlurBackground>
      <h2>Avisos</h2>
      <ul>
        {incidents.map((i) => (
          <li key={i.id}>
            <strong>{i.description}</strong> - <strong>{i.is_solved}</strong>
          </li>
        ))}
      </ul>

    </BlurBackground>
  );
}
