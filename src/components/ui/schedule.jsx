'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Schedule() {
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession();
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const diasSemana = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes'
  };

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (
      status !== 'authenticated' ||
      !session?.user?.id ||
      !session?.user?.accessToken
    ) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    axios
      .get(`${backendUrl}/lessons/schedule/${session.user.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((resp) => {
        const sortedSchedule = resp.data.sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return new Date(a.starts_at) - new Date(b.starts_at);
        });
        setSchedule(sortedSchedule);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('❌ Error al traer horario:', error);
          toast.error('Error al obtener horario');
        }
      });

    return () => controller.abort();
  }, [session, status]);

  if (isLoading) return <p>Cargando horario del usuario...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Horario Semanal</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-indigo-100">
            <th className="border px-4 py-2 text-left">Día</th>
            <th className="border px-4 py-2 text-left">Hora</th>
            <th className="border px-4 py-2 text-left">Asignatura</th>
            <th className="border px-4 py-2 text-left">Localización</th>
            <th className="border px-4 py-2 text-left">Grupo</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((clase, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{diasSemana[clase.day]}</td>
              <td className="border px-4 py-2">
                {new Date(clase.starts_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(clase.ends_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="border px-4 py-2">{clase.subject}</td>
              <td className="border px-4 py-2">{clase.location}</td>
              <td className="border px-4 py-2">{clase.group}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
