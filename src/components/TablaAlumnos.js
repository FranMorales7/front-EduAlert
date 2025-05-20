'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import StudentForm from './StudentsForm';


export default function TablaAlumnos() {
  const [students, setStudents] = useState([]);
  const abortControllerRef = useRef(null);
  const [filtros, setFiltros] = useState({ nombre: '', apellidos: '', curso: '', contacto: '' });
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
      .get(`${backendUrl}/students/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((response) => {
        console.log('Estudiantes--> ', response.data)
        setStudents(response.data);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer los alumnos:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [user]);

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const onCrear = async (nuevoAlumno) => {
    try {
      const response = await api.post(`${backendUrl}/students/`, nuevoAlumno, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setStudents((prev) => [...prev, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear alumno:', error);
    }
  };

  const onEditar = async ({data, id}) => {
    try {
      const response = await api.put(`${backendUrl}/students/${id}/`, data, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === response.data.id ? response.data : s))
      );
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al editar alumno:', error);
    }
  };

  const handleEliminar = (id) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    api
      .delete(`${backendUrl}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })
      .then(() => {
        setStudents((prev) => prev.filter((alumno) => alumno.id !== id));
      })
      .catch((err) => console.error('Error al eliminar alumno:', err));
  };

  const abrirEditar = (student) => {
  setSelectedStudent(student);
  setIsEditing(true);
  setIsModalOpen(true);
  };

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const datosFiltrados = students.filter((s) =>
    (s.name.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (`${s.last_name_1} ${s.last_name_2}`.toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
    (s.group?.name?.toLowerCase().includes(filtros.curso.toLowerCase())) &&
    (s.contact?.toLowerCase().includes(filtros.contacto.toLowerCase()))
  );

  if (status === 'loading') return <p className="p-6">Cargando sesión...</p>;
  if (status === 'unauthenticated') return <p className="p-6">No estás autenticado.</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedStudent(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nuevo alumno
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <input name="nombre" value={filtros.nombre} onChange={handleFiltro} placeholder="Filtrar por nombre" className="border px-3 py-2 rounded" />
        <input name="apellidos" value={filtros.apellidos} onChange={handleFiltro} placeholder="Filtrar por apellidos" className="border px-3 py-2 rounded" />
        <input name="curso" value={filtros.curso} onChange={handleFiltro} placeholder="Filtrar por curso" className="border px-3 py-2 rounded" />
        <input name="contacto" value={filtros.contacto} onChange={handleFiltro} placeholder="Filtrar por contacto" className="border px-3 py-2 rounded" />
      </div>

      <div className='max-h-[500px] overflow-auto rounded border border-gray-300'>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Apellidos</th>
              <th className="p-2 border">Edad</th>
              <th className="p-2 border">Curso</th>
              <th className="p-2 border">Contacto</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.last_name_1} {s.last_name_2}</td>
                <td className="p-2 border">{calcularEdad(s.birthdate)}</td>
                <td className="p-2 border">
                  <span className="relative group cursor-pointer">
                    {s.group?.name}
                    <span className="absolute left-1/2 -translate-x-1/2 mt-1 w-max hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10">
                      {s.group?.location}
                    </span>
                  </span>
                </td>
                <td className="p-2 border">{s.contact}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 hover:underline mr-4" onClick={() => abrirEditar(s)}>Editar</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleEliminar(s.id)}>Eliminar</button>
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
            <Dialog.Title className="text-lg font-bold mb-4">
              {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
            </Dialog.Title>
            <StudentForm
              initialData={selectedStudent}
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
