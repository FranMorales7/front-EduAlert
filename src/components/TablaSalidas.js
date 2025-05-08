'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';
import { Dialog } from '@headlessui/react';

export default function TablaSalidas() {
  const [trips, setTrips] = useState([]);
  const abortControllerRef = useRef(null);
  const [filtros, setFiltros] = useState({ descripcion: '', alumno: '', fecha: '', aula: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState(null);

  // Cuando ya se tiene la sesión, guardamos el ID de usuario
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!user) return; // Espera a que haya user

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    api
      .get(`${backendUrl}/trips/user/${user}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las salidas:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [user]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleEliminar = (id) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!user) return; // Espera a que haya user

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    api
      .delete(`${backendUrl}/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal,
      })
      .then(() => {
        // Actualizar el estado de salidas eliminando la incidencia eliminada
        setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al eliminar las incidencias:', error);
        }
      });

    return () => {
      controller.abort();
    };
  };

  const handleCrear = (nueva) => {
    setTrips([...trips, { ...nueva, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const datosFiltrados = trips.filter((i) =>
    (i.description?.toLowerCase() ?? '').includes(filtros.descripcion.toLowerCase()) &&
    (
      `${i.student?.name ?? ''} ${i.student?.last_name_1 ?? ''} ${i.student?.last_name_2 ?? ''}`
        .toLowerCase()
        .includes(filtros.alumno.toLowerCase())
    ) &&
    (i.created_at?.includes(filtros.fecha) ?? '') &&
    (i.lesson?.location?.toLowerCase().includes(filtros.aula.toLowerCase()) ?? '')
  );
  

  if (status === 'loading') return <p className="p-6">Cargando sesión...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Mis Salidas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nueva salida
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input name="descripcion" value={filtros.descripcion} onChange={handleFiltro} placeholder="Filtrar por descripción" className="border px-3 py-2 rounded" />
        <input name="alumno" value={filtros.alumno} onChange={handleFiltro} placeholder="Filtrar por alumno" className="border px-3 py-2 rounded" />
        <input name="fecha" type="date" value={filtros.fecha} onChange={handleFiltro} className="border px-3 py-2 rounded" />
        <input name="aula" value={filtros.aula} onChange={handleFiltro} placeholder="Filtrar por aula" className="border px-3 py-2 rounded" />
      </div>

      {/* Tabla */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border max-w-2xl">Descripción</th>
            <th className="p-2 border">Alumno</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Aula</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datosFiltrados.map((i) => (
            <tr key={i.id} className="hover:bg-gray-50">
              <td className="p-2 border max-w-2xl">{i.description}</td>
              <td className="p-2 border">
                {i.student?.name} {i.student?.last_name_1} {i.student?.last_name_2}
              </td>
              <td className="p-2 border">{i.created_at?.slice(0, 10)}</td>
              <td className="p-2 border">{i.lesson?.location}</td>
              <td className="p-2 border">
                <button className="cursor-pointer text-blue-600 hover:underline mr-4">Editar</button>
                <button className="cursor-pointer text-red-600 hover:underline" onClick={() => handleEliminar(i.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">Nueva Salida</Dialog.Title>
            <FormularioIncidencia onCrear={handleCrear} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

// Subcomponente del formulario
function FormularioIncidencia({ onCrear }) {
  const [form, setForm] = useState({ descripcion: '', fecha: '', aula: '', alumno: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.descripcion && form.fecha && form.aula && form.alumno) {
      onCrear(form);
      setForm({ descripcion: '', fecha: '', aula: '', alumno: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input name="alumno" placeholder="Alumno" value={form.alumno} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <input name="aula" placeholder="Aula" value={form.aula} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Crear</button>
    </form>
  );
}
