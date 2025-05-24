'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import LessonForm from '../forms/LessonForm';
import useAuthUser from '@/hooks/useAuthUser';
import { createLesson, deleteLesson, getAllLessons, updateLesson } from '@/requests/lessons';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';

export default function LessonsTable() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

   getAllLessons(session.user.accessToken, controller.signal)
      .then((res) => setLessons(res.data))
      .catch((err) => {console.error('Error al cargar clases:', err); setLoading(false)});

      return () => controller.abort();
    }, [user, status, session]);

  const onCrear = async (nuevaClase) => {
    try {
      const res = await createLesson(nuevaClase,session.user.accessToken)
      setIsModalOpen(false);
      setIsEditing(false);
      setLessons((prev) => [...prev, res.data]);

    } catch (err) {
      console.error('Error al crear clase:', err);
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const res = await updateLesson(id, data, session.user.accessToken);
      setLessons((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error al editar clase:', err);
    }
  };

  const onEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteLesson(id, session.user.accessToken, controller.signal);
      setLessons((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Error al eliminar clase:', err);
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

  if (status === loading) return <p className="p-6">Cargando datos...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
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
      <div className="max-h-[500px] overflow-auto rounded border border-gray-300">
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
                <td className="p-2 border">{l.location}</td>
                <td className="p-2 border">
                  {l.teacher?.name || 'Sin profesor asignado'} {l.teacher?.last_name_1 || ''} {l.teacher?.last_name_2 || ''}
                </td>
                <td className="p-2 border">
                  {l.group?.name || 'Sin grupo'}
                </td>
                <td className="p-2 border">{diasSemana[l.day - 1] || 'Desconocido'}</td>
                <td className="p-2 border">{formatHour(l.starts_at)} - {formatHour(l.ends_at)}</td>
                
                <td className="p-2 border">
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
              token={session?.user?.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
