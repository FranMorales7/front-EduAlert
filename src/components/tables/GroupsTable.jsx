'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import useAuthUser from '@/hooks/useAuthUser';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import GroupForm from '../forms/GroupForm';
import { createGroup, deleteGroup, getAllGroups, updateGroup } from '@/requests/groups';
import toast from 'react-hot-toast';

export default function GroupsTable() {
  const abortControllerRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

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

    getAllGroups(session.accessToken, controller.signal)
    .then((res) => {
      const grupos = res.data;
      setGroups(grupos);

      // Obtener tutores únicos
      const uniqueTutorsMap = new Map();
      grupos.forEach(g => {
        if (g.tutor && !uniqueTutorsMap.has(g.tutor.id)) {
          uniqueTutorsMap.set(g.tutor.id, g.tutor);
        }
      });
      setTutors(Array.from(uniqueTutorsMap.values()));

      setLoading(false);
    })
    .catch((err) => {
      console.error('Error al cargar grupos:', err);
      setLoading(false);
      toast.error('Error al obtener los grupos')
    });

    return () => controller.abort();
  }, [user, status, session]);

  const onCrear = async (nuevoGrupo) => {
    try {
      const res = await createGroup(nuevoGrupo, session.accessToken)
      setIsModalOpen(false);
      setIsEditing(false);
      setGroups((prev) => {
        const nuevos = [...prev, res.data];
        return nuevos; });
      toast.success('Grupo creado correctamente')
    } catch (err) {
      console.error('Error al crear grupo:', err);
      toast.error('Error en la creación del grupo')
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const res = await updateGroup(id, data, session.accessToken)
      setGroups((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      setIsModalOpen(false);
      setIsEditing(false);
      toast.success('Grupo actualizado correctamente')

    } catch (err) {
      console.error('Error al editar grupo:', err);
      toast.error('Error al actualizar el grupo')
    }
  };

  const onEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteGroup(id, session.accessToken, controller.signal);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Grupo eliminado con éxito')

    } catch (err) {
      console.error('Error al eliminar grupo:', err);
      toast.error('Error al eliminar el grupo')
    }
  };

  const abrirEditar = (grupo) => {
    setSelectedGroup(grupo);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  if (status === loading) return <p className="p-6">Cargando datos...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl inset-shadow-sm">
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
                <td className="p-2 border">{g.location.name}</td>
                <td className="p-2 border">
                  {g.tutor?.name} {g.tutor?.last_name_1} {g.tutor?.last_name_2 || ''}
                </td>

                <td className="p-2 border text-center">
                  <EditButton onClick={() => abrirEditar(g)} />
                  <DeleteButton onClick={() => onEliminar(g.id)} />
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
              clases={groups}
              token={session?.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
