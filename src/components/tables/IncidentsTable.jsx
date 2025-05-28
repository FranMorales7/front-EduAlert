'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { createIncident, deleteIncident, fetchIncidentsByUser, updateIncident } from '@/requests/incidents';
import useAuthUser from '@/hooks/useAuthUser';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import IncidentsForm from '../forms/IncidentsForm';
import toast from 'react-hot-toast';

export default function IncidentsTable() {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [filtros, setFiltros] = useState({ descripcion: '', alumno: '', fecha: '', aula: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const abortControllerRef = useRef(null);

  const { user, session, status } = useAuthUser();
  
  useEffect(() => {
    if (!user || status !== 'authenticated') return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetchIncidentsByUser(user.id, session.user.accessToken, controller.signal);

        if (!response?.data) throw new Error('No se encontraron incidencias');

        setIncidents(response.data);
        
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las incidencias:', error.message);
          toast.error('Error al obtener incidencias')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [user, session, status]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleEditarSubmit = async (editado) => {
    try {
      await updateIncident(
        editado.id,
        {
          is_solved: editado.is_solved,
          description: editado.descripcion,
          student_id: editado.student_id,
          lesson_id: editado.lesson_id,
        },
        session.user.accessToken
      );

      const res = await fetchIncidentsByUser(user.id, session.user.accessToken);
      setIncidents(res.data);
      cerrarModal();
      toast.success('Incidencia actualizada correctamente')

    } catch (err) {
      console.error('Error al editar incidencia:', err.message);
      toast.error('Error al actualizar la incidencia')
    }
  };

  const handleEliminar = async (id) => {

    try {
      const controller = new AbortController();
      await deleteIncident(id, session.user.accessToken, controller.signal);
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      toast.success('Incidencia eliminada con éxito')
    } catch (err) {
      console.error('Error al eliminar incidencia:', err.message);
      toast.error('Error al eliminar incidencia')
    }
  };

  const handleCrear = async (nueva) => {
    try {
      await createIncident(nueva, session.user.accessToken);
      const res = await fetchIncidentsByUser(user.id, session.user.accessToken);
      
      setIncidents(res.data);
      cerrarModal();
      toast.success('Incidencia creada correctamente')
    } catch (err) {
      console.error('Error al crear incidencia:', err.message);
      toast.error('Error al crear incidencia')
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingIncident(null);
  };

  const abrirModalEditar = (incidente) => {
    setEditingIncident({
      id: incidente.id,
      descripcion: incidente.description ?? '',
      fecha: incidente.created_at?.slice(0, 10) ?? '',
      aula: incidente.lesson?.location?.name ?? '',
      alumno: `${incidente.student?.name ?? ''} ${incidente.student?.last_name_1 ?? ''} ${incidente.student?.last_name_2 ?? ''}`.trim(),
      student_id: incidente.student?.id ?? null,
      lesson_id: incidente.lesson?.id ?? null,
      is_solved: incidente.is_solved ?? false,
    });
    setIsModalOpen(true);
  };

  const datosFiltrados = incidents.filter((i) => {
    const descripcionMatch =
      filtros.descripcion === '' ||
      (i.description?.toLowerCase() ?? '').includes(filtros.descripcion.toLowerCase());

    const alumnoTexto = `${i.student?.name ?? ''} ${i.student?.last_name_1 ?? ''} ${i.student?.last_name_2 ?? ''}`.toLowerCase();
    const alumnoMatch =
      filtros.alumno === '' || alumnoTexto.includes(filtros.alumno.toLowerCase());

    const fechaMatch =
      filtros.fecha === '' || i.created_at?.slice(0, 10) === filtros.fecha;

    const aulaMatch =
      filtros.aula === '' ||
      (i.lesson?.location?.name?.toLowerCase() ?? '').includes(filtros.aula.toLowerCase());

    return descripcionMatch && alumnoMatch && fechaMatch && aulaMatch;
  });


  if (loading) return <p className="p-4">Cargando panel de avisos...</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl inset-shadow-sm">
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
        <input name="descripcion" value={filtros.descripcion} onChange={handleFiltro} placeholder="Filtrar por descripción" className="border px-3 py-2 rounded" />
        <input name="alumno" value={filtros.alumno} onChange={handleFiltro} placeholder="Filtrar por alumno" className="border px-3 py-2 rounded" />
        <input name="aula" value={filtros.aula} onChange={handleFiltro} placeholder="Filtrar por aula" className="border px-3 py-2 rounded" />
      </div>

      {/* Tabla */}
      <div className='max-h-[520px] overflow-y-auto border border-gray-300'>
        <table className="w-full">
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
                <td className="p-2 border text-center">
                  <span className={`px-2 py-1 rounded text-white text-sm font-semibold ${i.is_solved ? 'bg-green-500' : 'bg-red-500'}`}>
                    {i.is_solved ? 'Resuelto' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-2 border max-w-2xl">{i.description}</td>
                <td className="p-2 border">
                  {i.student?.name} {i.student?.last_name_1} {i.student?.last_name_2}
                </td>
                <td className="p-2 border">{i.created_at?.slice(0, 10)}</td>
                <td className="p-2 border">{i.lesson?.location?.name}</td>
                <td className="p-2 border text-center">
                  <EditButton onClick={() => abrirModalEditar(i)} />
                  <DeleteButton onClick={() => handleEliminar(i.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={cerrarModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingIncident ? 'Editar Incidencia' : 'Nueva Incidencia'}
            </Dialog.Title>
            <IncidentsForm
              initialData={editingIncident}
              onCrear={handleCrear}
              onEditar={handleEditarSubmit}
              isEditing={!!editingIncident}
              token={session.user.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
