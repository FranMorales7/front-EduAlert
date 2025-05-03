'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/api/axios';
import { Tab } from '@headlessui/react';

export default function CardAvisos() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    api
      .get(`${backendUrl}/incidents`, {
        signal: controller.signal,
      })
      .then((response) => {
        setIncidents(response.data);
        console.log('Respuesta de incidentes: ', response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer los avisos:', error);
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const handleIncidentClick = (id) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const getIncidentUrl = `${backendUrl}/incidents/${id}`;
    console.log(`Realizando petición al endpoint: ${getIncidentUrl}`);

    api
      .get(getIncidentUrl)
      .then((response) => {
        console.log('Respuesta - getIncidente: ', response.data);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer los detalles del aviso:', error);
        }
      });
  };

  if (loading) return <p className="p-4">Cargando avisos...</p>;

  return (
    <Tab.Group>
    <Tab.List className=" mb-8">
        {incidents.map((i) => (
        <Tab
        key={i.id}
        className={({ selected }) =>
            `px-4 py-2 mb-2 rounded flex items-center gap-8 ${
            selected ? 'bg-blue-600 text-white' : 'bg-white text-black'
            } shadow border`
        }
        onClick={() => handleIncidentClick(i.id)}
        >
        <span
            className={`h-3 w-3 rounded-full ${
            i.is_solved ? 'bg-green-500' : 'bg-red-500'
            }`}
        />
        {/* Localización de la lección */}
        <span>{i.lesson?.location}</span>

        {/* Hora de creación */}
        <span className="text-sm text-gray-500">
            {new Date(i.created_at).toLocaleString()}
        </span>
        
        </Tab>
        ))}
    </Tab.List>
    <Tab.Panels>
        {incidents.map((i) => (
        <Tab.Panel key={i.id} className="bg-white p-4 rounded shadow">
           
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
            
            {/* Información detallada del incidente */}
            <p>
            <strong>Descripción:</strong> {i.description}
            </p>

        </Tab.Panel>
        ))}
    </Tab.Panels>
    </Tab.Group>
  );
}