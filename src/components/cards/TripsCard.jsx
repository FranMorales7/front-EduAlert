'use client';

import { useEffect, useState, useRef } from 'react';
import { Tab } from '@headlessui/react';
import useAuthUser from '@/hooks/useAuthUser';
import { getAllTrips } from '@/requests/trips';
import toast from 'react-hot-toast';

export default function TripsCard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  // Obtener usuario de la sesión
  const { user, session, status } = useAuthUser();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    getAllTrips(session.accessToken, controller.signal)
      .then((resp) => { setTrips(resp.data); setLoading(false)})
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las salidas:', error);
          toast.error('Error al obtener las salidas');
        }
        setLoading(false);
      });

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
            <span>{i.lesson?.location?.name ?? 'Sin aula asignada'}</span>

            {/* Hora de creación */}
            <span className="text-sm text-amber-100">
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
