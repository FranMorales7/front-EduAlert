'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import LessonForm from '../forms/LessonForm';
import useAuthUser from '@/hooks/useAuthUser';
import { createLesson, deleteLesson, getAllLessons, updateLesson } from '@/requests/lessons';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import toast from 'react-hot-toast';

export default function LessonsTable() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ descripcion: '', ubicacion: '', profesor: '' });
  const [selectedLesson, setSelectedLesson] = useState(null);
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

   getAllLessons(session.accessToken, controller.signal)
      .then((res) => setLessons(res.data))
      .catch((err) => {
        console.error('Error al cargar clases:', err),
        setLoading(false),
        toast.error('Error al obtener las clases')
        }
      );

      return () => controller.abort();
    }, [user, status, session]);

  const onCrear = async (nuevaClase) => {
    try {
      const res = await createLesson(nuevaClase,session.accessToken)
      setIsModalOpen(false);
      setIsEditing(false);
      setLessons((prev) => [...prev, res.data]);
      toast.success('Clase creada correctamente')

    } catch (err) {
      console.error('Error al crear clase:', err);
      toast.error('Error en la creación de la clase');
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const res = await updateLesson(id, data, session.accessToken);
      setLessons((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setIsModalOpen(false);
      setIsEditing(false);
      toast.success('Clase actualizada correctamente')

    } catch (err) {
      console.error('Error al editar clase:', err);
      toast.error('Error al actualizar datos de la clase');
    }
  };

  const onEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteLesson(id, session.accessToken, controller.signal);
      setLessons((prev) => prev.filter((g) => g.id !== id));
      toast.success('Clase eliminada correctamente');

    } catch (err) {
      console.error('Error al eliminar lección:', err);
      toast.error('Error al eliminar la clase')
    }
  };


  const abrirEditar = (grupo) => {
    setSelectedLesson(grupo);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const formatHour = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredLessons = lessons.filter((l) => {
    const descMatch = l.description.toLowerCase().includes(filters.descripcion.toLowerCase());
    const locMatch = l.location.name.toLowerCase().includes(filters.ubicacion.toLowerCase());
    const teacherFullName = `${l.teacher?.name || ''} ${l.teacher?.last_name_1 || ''} ${l.teacher?.last_name_2 || ''}`;
    const teacherMatch = teacherFullName.toLowerCase().includes(filters.profesor.toLowerCase());

    return descMatch && locMatch && teacherMatch;
  });

  if (status === loading) return <p className="p-6">Cargando datos...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl inset-shadow-sm mt-2">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedLesson(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nueva clase
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input
          name="descripcion"
          type="text"
          placeholder="Filtrar por descripción"
          value={filters.descripcion}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="ubicacion"
          type="text"
          placeholder="Filtrar por ubicación"
          value={filters.ubicacion}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="profesor"
          type="text"
          placeholder="Filtrar por profesor/a"
          value={filters.profesor}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="max-h-[500px] overflow-auto rounded border border-gray-300 text-center">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Ubicación</th>
              <th className="p-2 border">Profesor/a</th>
              <th className="p-2 border">Grupo</th>
              <th className="p-2 border">Día</th>
              <th className="p-2 border">Horario</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-2 border">{l.description}</td>
                <td className="p-2 border">{l.location.name}</td>
                <td className="p-2 border">
                  {l.teacher?.name || 'Sin profesor asignado'} {l.teacher?.last_name_1 || ''} {l.teacher?.last_name_2 || ''}
                </td>
                <td className="p-2 border">
                  {l.group?.name || 'Sin grupo'}
                </td>
                <td className="p-2 border">{diasSemana[l.day - 1] || 'Desconocido'}</td>
                <td className="p-2 border">{formatHour(l.starts_at)} - {formatHour(l.ends_at)}</td>
                
                <td className="p-2 border text-center flex gap-2">
                  <EditButton onClick={() => abrirEditar(l)} />
                  <DeleteButton onClick={() => onEliminar(l.id)} />
                   
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded max-w-lg w-full shadow-xl">
            <LessonForm
              initialData={selectedLesson}
              onCrear={onCrear}
              onEditar={onEditar}
              isEditing={isEditing}
              token={session?.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
