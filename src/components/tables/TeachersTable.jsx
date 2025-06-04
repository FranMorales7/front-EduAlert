'use client';

import { useEffect, useState, useRef } from 'react';
import useAuthUser from '@/hooks/useAuthUser';
import { Dialog } from '@headlessui/react';
import TeacherForm from '../forms/TeacherForm';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import { createTeacher, deleteTeacher, getAllTeachers, updateTeacher } from '@/requests/teachers';
import toast from 'react-hot-toast';

export default function TeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', apellidos: '', email: '' });
  const abortControllerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
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

    getAllTeachers(session.accessToken, controller.signal)
      .then((res) => setTeachers(res.data))
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          console.error('Error al traer profesores:', err);
        }
        setLoading(false)
      });

    return () => { controller.abort(); };
  }, [user, status, session]);

  const onCrear = async (nuevoTeacher) => {
    try {
      const response = await createTeacher(nuevoTeacher, session.accessToken)
      setIsModalOpen(false)
      setIsEditing(false);
      setTeachers((prev) => {
          const nuevos = [...prev, response.data];
          return nuevos; });
      toast.success('Profesor creado correctamente');
        
    } catch (error) {
      console.error('Error al crear profesor:', error);
      toast.error('Error en la creación de un profesor')
    }
  };

  const onEditar = async ({ data, id }) => {
    try {
      const response = await updateTeacher(id, data, session.accessToken)
      setTeachers((prev) => prev.map((t) => (t.id === response.data.id ? response.data : t)));
      setIsModalOpen(false);
      setIsEditing(false);
      toast.success('Datos del profesor actualizados correctamente')

    } catch (error) {
      console.error('Error al editar profesor:', error);
      toast.error('Error al actualizar datos del profesor')
    }
  };

  const handleEliminar = async (id) => {
    try{
      const controller = new AbortController();
      await deleteTeacher(id, session.accessToken, controller.signal);
      setTeachers((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Error al eliminar profesor: ', err)
      toast.error('Error al eliminar al profesor')
    }
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

  if (status === loading) return <p className="p-6">Cargando datos...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl inset-shadow-sm">
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

      <div className="grid grid-cols-4 gap-4 mb-4">
        <input name="nombre" value={filtros.nombre} onChange={handleFiltro} placeholder="Filtrar por nombre" className="border px-3 py-2 rounded" />
        <input name="apellidos" value={filtros.apellidos} onChange={handleFiltro} placeholder="Filtrar por apellidos" className="border px-3 py-2 rounded" />
        <input name="email" value={filtros.email} onChange={handleFiltro} placeholder="Filtrar por email" className="border px-3 py-2 rounded" />
      </div>

      <div className="max-h-[500px] overflow-auto rounded border border-gray-300 text-center">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Apellidos</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <span className={`px-2 py-1 rounded text-white text-sm font-semibold
                    ${t.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                    {t.is_active ? 'En activo' : 'De baja'}
                  </span>
                </td>
                <td className="p-2 border">{t.name}</td>
                <td className="p-2 border">{t.last_name_1} {t.last_name_2}</td>
                <td className="p-2 border">{t.email}</td>
                <td className="p-2 border text-center">
                  <EditButton onClick={() => abrirEditar(t)} />
                  <DeleteButton onClick={() => handleEliminar(t.id)} />
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
              onSubmit={(formData) => {
                if (isEditing && selectedTeacher) {
                  onEditar({ data: formData, id: selectedTeacher.user_id });
                } else {
                  onCrear(formData);
                }
              }}
              isEditing={isEditing}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
