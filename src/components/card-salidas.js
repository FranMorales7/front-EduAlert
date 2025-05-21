'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/api/axios';
import { useSession } from 'next-auth/react';
import { Tab } from '@headlessui/react';

export default function CardSalidas() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState(null);

  // Cuando ya se tiene la sesión, guardamos el ID de usuario
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    // Si no está autenticado, no se hace la solicitud
    if (status !== 'authenticated') return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Si ya había una solicitud en curso, la abortamos
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    api
      .get(`${backendUrl}/trips`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal, // Utilizamos la señal de aborto
      })
      .then((response) => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las salidas:', error);
        }
        setLoading(false);
      });

    // Cleanup: aborta la solicitud cuando el componente se desmonta o la sesión cambia
    return () => {
      controller.abort();
    };
  }, [user, status, session]);

  if (loading) return <p className="p-4">Cargando salidas...</p>;

  return (
    <Tab.Group>
      {/** Limitar a 8 las salidas, el resto se verán haciendo scroll **/}
      <div className="max-h-96 overflow-y-auto mb-8">
      <Tab.List className=" mb-8">
        {trips.map((i) => (
          <Tab
            key={i.id}
            className={({ selected }) =>
              `border-2 border-black ${i.is_solved ? 'hover:border-green-300' : 'hover:border-red-300'} px-4 py-2 mb-2 rounded flex items-center gap-8 ${
                selected ? 'bg-sky-400 text-white' : 'bg-white text-black'
              } shadow border cursor-pointer`
            }
          >
            <span
              className={`h-5 w-5 border-1 border-black rounded-full ${
                i.is_solved ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {/* Localización de la salida */}
            <span>{i.lesson?.location}</span>

            {/* Hora de creación */}
            <span className="text-sm text-gray-500">
              {new Date(i.created_at).toLocaleString()}
            </span>
          </Tab>
        ))}
      </Tab.List>
      </div>
      <Tab.Panels>
        {trips.map((i) => (
          <Tab.Panel key={i.id} className="border-1 border-gray-300 shadow-xl bg-white p-4 rounded">
            {/* Información del alumno */}
            {i.student && (
              <p>
                <strong>Alumno:</strong> {i.student?.name} {i.student?.last_name_1} {i.student?.last_name_2}
              </p>
            )}

            {/* Información del profesor */}
            {i.teacher && (
              <p>
                <strong>Profesor:</strong> {i.teacher?.name} {i.teacher?.last_name_1} {i.teacher?.last_name_2}
              </p>
            )}

            {/* Información detallada de la salida */}
            <p>
              <strong>Descripción:</strong> {i.description}
            </p>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
