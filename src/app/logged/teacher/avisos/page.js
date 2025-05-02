'use client';

import { useEffect, useState, useRef } from 'react';
import BlurBackground from '@/components/BlurBackground';
import api from '@/api/axios';
import { Tab } from '@headlessui/react';

export default function IncidentList() {
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

  if (loading) return <p className="p-4">Cargando avisos...</p>;

  return (
    <BlurBackground>
      <h2 className="text-xl font-semibold mb-4">Avisos</h2>
      <Tab.Group>
        <Tab.List className="flex flex-wrap gap-2 mb-4">
          {incidents.map((i) => (
            <Tab
            key={i.id}
            className={({ selected }) =>
              `px-4 py-2 rounded flex items-center gap-2 ${
                selected ? 'bg-blue-600 text-white' : 'bg-white text-black'
              } shadow border`
            }
          >
            <span
              className={`h-3 w-3 rounded-full ${
                i.is_solved ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {i.description}
          </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {incidents.map((i) => (
            <Tab.Panel key={i.id} className="bg-white p-4 rounded shadow">
              <p><strong>Descripción:</strong> {i.description}</p>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </BlurBackground>
  );
}
