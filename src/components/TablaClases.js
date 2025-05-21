'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import api from '@/api/axios';
import GroupForm from './GroupForm';

export default function TablaGrupos() {
  const [groups, setGroups] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const abortControllerRef = useRef(null);

  const { data: session, status } = useSession();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    api.get(`${backendUrl}/groups/`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
      signal: controller.signal,
    })
      .then((res) => setGroups(res.data))
      .catch((err) => console.error('Error al cargar grupos:', err));

    api.get(`${backendUrl}/teachers/`, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    })
      .then((res) => setTutors(res.data))
      .catch((err) => console.error('Error al cargar tutores:', err));

    return () => controller.abort();
  }, [session]);

  const onCrear = async (nuevoGrupo) => {
    try {
      const res = await api.post(`${backendUrl}/groups/`, nuevoGrupo, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setGroups((prev) => [...prev, res.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al crear grupo:', err);
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const res = await api.put(`${backendUrl}/groups/${id}/`, data, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setGroups((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error al editar grupo:', err);
    }
  };

  const onEliminar = async (id) => {
    try {
      await api.delete(`${backendUrl}/groups/${id}/`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Error al eliminar grupo:', err);
    }
  };

  const abrirEditar = (grupo) => {
    setSelectedGroup(grupo);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedGroup(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nuevo grupo
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto rounded border border-gray-300">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Ubicación</th>
              <th className="p-2 border">Tutor</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="p-2 border">{g.name}</td>
                <td className="p-2 border">{g.location}</td>
                <td className="p-2 border">{tutors.find(t => t.id === g.tutor_id)?.name || 'Sin tutor'}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 hover:underline mr-4" onClick={() => abrirEditar(g)}>
                    Editar
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => onEliminar(g.id)}>
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
            <GroupForm
              initialData={selectedGroup}
              onCrear={onCrear}
              onEditar={onEditar}
              isEditing={isEditing}
              tutores={tutors}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
