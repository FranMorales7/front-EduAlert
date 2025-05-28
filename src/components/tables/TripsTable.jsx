'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import useAuthUser from '@/hooks/useAuthUser';
import { createTrip, deleteTrip, fetchTripsByUser, updateTrip } from '@/requests/trips';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import TripsForm from '../forms/TripsForm';
import toast from 'react-hot-toast';

export default function TripsTable() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const abortControllerRef = useRef(null);
  const [filtros, setFiltros] = useState({ descripcion: '', alumno: '', fecha: '', aula: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrips, setEditingTrips] = useState(null);
  const router = useRouter();

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

    fetchTripsByUser(user.id, session.user.accessToken, controller.signal)
      .then( (resp) => {setTrips(resp.data)})
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las salidas:', error);
          toast.error('Error al obtener las salidas')
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
          await updateTrip(editado.id, {
            id: editado.id,
            is_solved: editado.is_solved,
            description: editado.descripcion,
            created_at: editado.fecha,
          }, session.user.accessToken);

        setTrips((prev) =>
          prev.map((inc) =>
            inc.id === editado.id
              ? {
                  ...inc,
                  description: editado.description,
                  created_at: editado.fecha,
                }
              : inc
          )
        );
        setIsModalOpen(false);
        setEditingTrips(null);
        toast.success('Salida actualizada correctamente');

      } catch (err) {
      console.error('Error al editar salida:', err);
      toast.error('Error al editar la salida');
    }
  };

  const handleEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteTrip(id, session.user.accessToken, controller.signal);
      setTrips((prev) => prev.filter((i) => i.id !== id)) // Eliminar localmente
      toast.success('Salida eliminada con éxito');
    } catch (err) {
      console.error('Error al eliminar salida:', err);
      toast.error('Error al eliminar la salida');
    }
  };

  const handleCrear = async (nueva) => {
    try {
      const nuevaSalida = {
        ...nueva,
        teacher_id: user.id,
      };

      const resp = await createTrip(nuevaSalida, session.user.accessToken);
      setIsModalOpen(false);
      setEditingTrips(null);
      setTrips((prev) => { 
        const nuevos = [...prev, resp.data];
        return nuevos; 
      }); // Actualizar localmente
      toast.success('Salida creada correctamente');

    } catch (err) {
      console.error('Error al crear la salida:', err);
      toast.error('Error en la creación de la salida');
    }
  };
  
  const abrirModalEditar = (salida) => {
    setEditingTrips(salida); // carga datos en formulario
    setIsModalOpen(true);
  }

   const datosFiltrados = trips.filter((i) => {
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

  if (loading) return <p className="p-6">Cargando datos...</p>;

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl inset-shadow-sm">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          + Nueva salida
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
                <td className="p-2 border">{i.lesson?.location?.name}</td>
                <td className="p-2 border text-center">
                  <EditButton onClick={() => abrirModalEditar(i)} /> 
                  <DeleteButton onClick={() => handleEliminar(i.id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTrips(null); }} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingTrips ? 'Editar Salida' : 'Nueva Salida'}
            </Dialog.Title>
            <TripsForm
              initialData={editingTrips}
              onCrear={handleCrear}
              onEditar={handleEditarSubmit}
              isEditing={!!editingTrips} 
              token={session.user.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}