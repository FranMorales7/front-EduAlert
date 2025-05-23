'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import LessonForm from './LessonForm';
import axios from 'axios';

export default function TablaClases() {
  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const abortControllerRef = useRef(null);

  const { data: session, status } = useSession();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    axios.get(`${backendUrl}/lessons/`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
      signal: controller.signal,
    })
      .then((res) => setLessons(res.data))
      .catch((err) => console.error('Error al cargar clases:', err));

    axios.get(`${backendUrl}/teachers/`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    })
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error('Error al cargar profesores:', err));

    axios.get(`${backendUrl}/groups/`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    }).then((res) => setGroups(res.data)).catch(console.error);

    return () => controller.abort();
  }, [session]);

  const onCrear = async (nuevaClase) => {
    try {
      const res = await axios.post(`${backendUrl}/lessons/`, nuevaClase, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setLessons((prev) => [...prev, res.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al crear clase:', err);
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const res = await axios.put(`${backendUrl}/lessons/${id}/`, data, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setLessons((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error al editar clase:', err);
    }
  };

  const onEliminar = async (id) => {
    try {
      await axios.delete(`${backendUrl}/lessons/${id}/`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
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
              <th className="p-2 border">Comienzo</th>
              <th className="p-2 border">Finalización</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-2 border">{l.description}</td>
                <td className="p-2 border">{l.location}</td>
                <td className="p-2 border">{teachers.find(t => t.id === l.teacher_id)?.name || 'Sin profesor'}</td>
                <td className="p-2 border">{groups.find(g => g.id === l.group_id)?.name || 'Sin grupo'}</td>
                <td className="p-2 border">{diasSemana[l.day - 1] || 'Desconocido'}</td>
                <td className="p-2 border">{formatHour(l.starts_at)}</td>
                <td className="p-2 border">{formatHour(l.ends_at)}</td>
                
                <td className="p-2 border">
                  <button className="text-blue-600 hover:underline mr-4" onClick={() => abrirEditar(l)}>
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => onEliminar(l.id)}>
                    Eliminar
                  </button>
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
              profesores={teachers}
              grupos={groups}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
