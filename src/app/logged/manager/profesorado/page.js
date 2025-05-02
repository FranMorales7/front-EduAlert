'use client'; // si estás en Next.js App Router

import { useEffect, useState, useRef } from 'react';
import BlurBackground from '@/components/BlurBackground';
import api from '@/api/axios';

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .get(`${backendUrl}/teachers`)
      .then((response) => {
        setTeachers(response.data);   // guardamos los profesores.
        setLoading(false);         // dejamos de cargar
      })
      .catch((error) => {
        console.error('Error al traer los profesores.:', error);
        setLoading(false);
      });

      // Limpiar la petición si el componente se desmonta
      return () => {
        controller.abort();
      };

  }, []);

  if (loading) return <p>Cargando profesores...</p>;

  return (
    <BlurBackground>
      <h2>Profesores</h2>
      <ul>
        {teachers.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> - <strong>{t.email}</strong>
          </li>
        ))}
      </ul>
    </BlurBackground>
  );
}
