'use client'; // si estás en Next.js App Router

import { useEffect, useState, useRef } from 'react';
import BlurBackground from '@/components/BlurBackground';
import api from '@/api/axios';

export default function StudentssList() {
  const [students, setStudents] = useState([]);
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
      .get(`${backendUrl}/students`)
      .then((response) => {
        setStudents(response.data);   // guardamos los alumnos.
        setLoading(false);         // dejamos de cargar
      })
      .catch((error) => {
        console.error('Error al traer los alumnos.:', error);
        setLoading(false);
      });

      // Limpiar la petición si el componente se desmonta
      return () => {
        controller.abort();
      };

  }, []);

  if (loading) return <p>Cargando alumnos...</p>;

  return (
    <BlurBackground>
      <h2>Alumnos</h2>
      <ul>
        {students.map((u) => (
          <li key={u.id}>
            <strong>{u.name}</strong> - <strong>{u.group_id}</strong>
          </li>
        ))}
      </ul>
    </BlurBackground>
  );
}
