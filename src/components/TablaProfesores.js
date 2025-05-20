'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import TeacherForm from './TeacherForm';

export default function TablaProfesores() {
  const [teachers, setTeachers] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', apellidos: '', email: '' });
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    if (!user) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    api
      .get(`${backendUrl}/teachers/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((res) => setTeachers(res.data))
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          console.error('Error al traer profesores:', err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [user]);

  const onCrear = async (nuevoTeacher) => {
    try {
      const response = await api.post(`${backendUrl}/users/`, nuevoTeacher, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setTeachers((prev) => [...prev, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear profesor:', error);
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const response = await api.put(`${backendUrl}/teachers/${id}/`, data, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setTeachers((prev) => prev.map((t) => (t.id === response.data.id ? response.data : t)));
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al editar profesor:', error);
    }
  };

  const handleEliminar = (id) => {
    api
      .delete(`${backendUrl}/teachers/${id}/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })
      .then(() => {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => console.error('Error al eliminar profesor:', err));
  };

  const abrirEditar = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const datosFiltrados = teachers.filter((t) =>
    t.name.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
    `${t.last_name_1} ${t.last_name_2}`.toLowerCase().includes(filtros.apellidos.toLowerCase()) &&
    t.email.toLowerCase().includes(filtros.email.toLowerCase())
  );

  if (status === 'loading') return <p className="p-6">Cargando sesión...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedTeacher(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nuevo profesor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input name="nombre" value={filtros.nombre} onChange={handleFiltro} placeholder="Filtrar por nombre" className="border px-3 py-2 rounded" />
        <input name="apellidos" value={filtros.apellidos} onChange={handleFiltro} placeholder="Filtrar por apellidos" className="border px-3 py-2 rounded" />
        <input name="email" value={filtros.email} onChange={handleFiltro} placeholder="Filtrar por email" className="border px-3 py-2 rounded" />
      </div>

      <div className="max-h-[500px] overflow-y-auto rounded border border-gray-300">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Apellidos</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Activo</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-2 border">{t.name}</td>
                <td className="p-2 border">{t.last_name_1} {t.last_name_2}</td>
                <td className="p-2 border">{t.email}</td>
                <td className="p-2 border">{t.is_active ? 'Sí' : 'No'}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 hover:underline mr-4" onClick={() => abrirEditar(t)}>Editar</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleEliminar(t.id)}>Eliminar</button>
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
            <TeacherForm
              initialData={selectedTeacher}
              onCrear={onCrear}
              onEditar={onEditar}
              isEditing={isEditing}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
