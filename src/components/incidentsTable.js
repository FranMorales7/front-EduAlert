'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import FormularioAviso from './FormularioAvisos';
import { createIncident, deleteIncident, fetchIncidentsByUser, updateIncident } from '@/requests/incidents';
import useAuthUser from '@/hooks/useAuthUser';

export default function IncidentsTable() {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [filtros, setFiltros] = useState({ descripcion: '', alumno: '', fecha: '', aula: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const abortControllerRef = useRef(null);

  // Obtener usuario de la sesión
  const { user, session, status } = useAuthUser();

  useEffect(() => {

    if (!user || status !== 'authenticated') return; 

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    fetchIncidentsByUser(user.id, session.user.accessToken, controller.signal)
      .then( (res) => setIncidents(res.data) )
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las incidencias:', error);
        }
        setLoading(false);
      });

    return () => { controller.abort(); };
    }, [user, status, session]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleEditarSubmit = async (editado) => {
    try {
      await updateIncident(editado.id, {
        id: editado.id,
        is_solved: editado.is_solved,
        description: editado.descripcion,
        created_at: editado.fecha,
      }, session.user.accessToken);

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === editado.id
            ? { ...inc, description: editado.descripcion, created_at: editado.fecha }
            : inc
        )
      );
      setIsModalOpen(false);
      setEditingIncident(null);
    } catch (err) {
      console.error('Error al editar incidencia:', err);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteIncident(id, session.user.accessToken, controller.signal);
      setIncidents((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Error al eliminar incidencia:', err);
    }
  };

  const handleCrear = async (nueva) => {
    try {
      const nuevaIncidencia = {
        ...nueva,
        teacher_id: user.id,
      };

      const response = await createIncident(nuevaIncidencia, session.user.accessToken);
      setIsModalOpen(false);
      setEditingIncident(null);
      
    } catch (err) {
      console.error('Error al crear incidencia:', err);
    }
  };

  const abrirModalEditar = (incidente) => {
    setEditingIncident(incidente); // carga datos en formulario
    setIsModalOpen(true);
  }

  const datosFiltrados = incidents.filter((i) =>
    (i.description?.toLowerCase() ?? '').includes(filtros.descripcion.toLowerCase()) &&
    (
      `${i.student?.name ?? ''} ${i.student?.last_name_1 ?? ''} ${i.student?.last_name_2 ?? ''}`
        .toLowerCase()
        .includes(filtros.alumno.toLowerCase())
    ) &&
    (i.created_at?.includes(filtros.fecha) ?? '') &&
    (i.lesson?.location?.toLowerCase().includes(filtros.aula.toLowerCase()) ?? '')
  );
  
  if (loading) return <p className="p-4">Cargando panel de avisos...</p>;
  if (status === 'loading') return <p className="p-6">Cargando sesión...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nueva incidencia
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* <button name="estado" value={filtros.estado} onChange={handleFiltro} className="cursor-pointer border rounded">Estado</button> */}
        <input name="descripcion" value={filtros.descripcion} onChange={handleFiltro} placeholder="Filtrar por descripción" className="border px-3 py-2 rounded" />
        <input name="alumno" value={filtros.alumno} onChange={handleFiltro} placeholder="Filtrar por alumno" className="border px-3 py-2 rounded" />
        <input name="fecha" type="date" value={filtros.fecha} onChange={handleFiltro} className="border px-3 py-2 rounded" />
        <input name="aula" value={filtros.aula} onChange={handleFiltro} placeholder="Filtrar por aula" className="border px-3 py-2 rounded" />
      </div>

      {/* Tabla */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Estado</th>
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
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded text-white text-sm font-semibold
                  ${i.is_solved ? 'bg-green-500' : 'bg-red-500'}`}>
                  {i.is_solved ? 'Resuelto' : 'Pendiente'}
                </span>
              </td>
              <td className="p-2 border max-w-2xl">{i.description}</td>
              <td className="p-2 border">
                {i.student?.name} {i.student?.last_name_1} {i.student?.last_name_2}
              </td>
              <td className="p-2 border">{i.created_at?.slice(0, 10)}</td>
              <td className="p-2 border">{i.lesson?.location}</td>
              <td className="p-2 border">
                <button className="cursor-pointer text-blue-600 hover:underline mr-4" onClick={() => abrirModalEditar(i)}>Editar</button>
                <button className="cursor-pointer text-red-600 hover:underline" onClick={() => handleEliminar(i.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingIncident(null); }} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingIncident ? 'Editar Incidencia' : 'Nueva Incidencia'}
            </Dialog.Title>
            <FormularioAviso 
              initialData={editingIncident}
              onCrear={handleCrear}
              onEditar={handleEditarSubmit}
              isEditing={!!editingIncident} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}