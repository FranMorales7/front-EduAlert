'use client'; // si estás en Next.js App Router

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     // Usamos la variable de entorno para la URL base
     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // Petición HTTP con Axios
    axios
      .get(`${backendUrl}/teachers`)
      .then((response) => {
        setTeachers(response.data);   // guardamos los profesores
        setLoading(false);         // dejamos de cargar
      })
      .catch((error) => {
        console.error('Error al traer los profesores:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando profesores...</p>;

  return (
    <div>
      <h2>Profesores</h2>
      <ul>
        {teachers.map((u) => (
          <li key={u.id}>
            <strong>{u.name}</strong> – {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
