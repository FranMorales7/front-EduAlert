'use client'; // si estás en Next.js App Router

import { useEffect, useState, useRef } from 'react';
import BlurBackground from '@/components/BlurBackground';
import api from '@/api/axios';

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null); // Cancelar peticion si se realiza otra

  useEffect(() => {
    // Usamos la variable de entorno para la URL base
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Cancela cualquier petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

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

      // Limpiar la petición si el componente se desmonta
      return () => {
        controller.abort();
      };
  }, []);

  if (loading) return <p>Cargando avisos...</p>;

  return (
    <BlurBackground>
    <h2 className="text-xl font-semibold mb-4">Avisos</h2>
    <ul className="space-y-2">
      {incidents.map((i) => (
        <li key={i.id} className="bg-white rounded p-4 shadow">
          <strong>{i.description}</strong> -{' '}
          <span className={i.is_solved ? 'text-green-600' : 'text-red-600'}>
            {i.is_solved ? 'Resuelto' : 'Pendiente'}
          </span>
        </li>
      ))}
    </ul>
  </BlurBackground>
  );
}
