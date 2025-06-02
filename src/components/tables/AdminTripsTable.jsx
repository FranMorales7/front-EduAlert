'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import useAuthUser from '@/hooks/useAuthUser';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import ConfirmModal from '../ui/confirmModal';
import { deleteTrip, getAllTrips, updateTrip } from '@/requests/trips';
import TripsForm from '../forms/TripsForm';
import AdminTripsForm from '../forms/AdminTripsForm';
import toast from 'react-hot-toast';

export default function AdminTripsTable() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [filtros, setFiltros] = useState({ descripcion: '', alumno: '', fecha: '', aula: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const abortControllerRef = useRef(null);

  const { user, session, status } = useAuthUser();

  useEffect(() => {
    if (!user || status !== 'authenticated') return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllTrips(session.accessToken, controller.signal);

        if (!response?.data) throw new Error('No se encontraron salidas');

        setTrips(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer las salidas:', error.message);
          toast.error('Error al obtener las salida')
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
      await updateTrip(
        editado.id,
        {
          is_solved: editado.is_solved,
          description: editado.descripcion,
          student_id: editado.student_id,
          lesson_id: editado.lesson_id,
        },
        session.accessToken
      );
      toast.success(`Actualización realizada correctamente`);

      // Refrescar datos en la página
      const res = await getAllTrips(session.accessToken);
      setTrips(res.data);
      cerrarModal();

    } catch (err) {
      toast.error(`Error al editar datos`);
      console.error('Error al actualizar salida:', err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const controller = new AbortController();
      await deleteTrip(id, session.accessToken, controller.signal);
      
      // Refrescar datos
      setTrips((prev) => prev.filter((i) => i.id !== id));
      toast.success('Salida eliminada con éxito')
    } catch (err) {
      console.error('Error al eliminar salida:', err.message);
      toast.error('Error al eliminar salida');
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
  };

  const abrirModalEditar = (salida) => {
    // Formatear datos
    setEditingTrip({
      id: salida.id,
      descripcion: salida.description ?? '',
      fecha: salida.created_at?.slice(0, 10) ?? '',
      aula: salida.lesson?.location?.name ?? '',
      alumno: `${salida.student?.name ?? ''} ${salida.student?.last_name_1 ?? ''} ${salida.student?.last_name_2 ?? ''}`.trim(),
      student_id: salida.student?.id ?? null,
      lesson_id: salida.lesson?.id ?? null,
      is_solved: salida.is_solved ?? false,
    });

    setIsModalOpen(true);
  };

  const delSolvedTrip = async () => {
    try {
        const controller = new AbortController();
        trips.map((i) => {
            if(i.is_solved == true){
                const id =  i.id;
                deleteTrip(id, session.accessToken, controller.signal);
                setTrips((prev) => prev.filter((tr) => tr.id !== id));
            };
        })
        } catch (err) {
            console.error('Error al eliminar salidas resueltas:', err.message);
        } finally {
            // Refrescar datos
            setShowConfirm(false); // Cerramos el modal después de la acción
        }
};

  const datosFiltrados = trips.filter((i) =>
    (i.description?.toLowerCase() ?? '').includes(filtros.descripcion.toLowerCase()) &&
    (
      `${i.student?.name ?? ''} ${i.student?.last_name_1 ?? ''} ${i.student?.last_name_2 ?? ''}`
        .toLowerCase()
        .includes(filtros.alumno.toLowerCase())
    ) &&
    (i.created_at?.includes(filtros.fecha) ?? '') &&
    (i.lesson?.location?.name.toLowerCase().includes(filtros.aula.toLowerCase()) ?? '')
  );

  if (loading) return <p className="p-4">Cargando panel de salidas...</p>;

  return (
    <div className='p-6 bg-white shadow-xl rounded-xl inset-shadow-sm'>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowConfirm(true)}
          className="cursor-pointer px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-600"
        >
          Eliminar salidas resueltas
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input name="descripcion" value={filtros.descripcion} onChange={handleFiltro} placeholder="Filtrar por descripción" className="border px-3 py-2 rounded" />
        <input name="alumno" value={filtros.alumno} onChange={handleFiltro} placeholder="Filtrar por alumno" className="border px-3 py-2 rounded" />
        <input name="fecha" type="date" value={filtros.fecha} onChange={handleFiltro} className="border px-3 py-2 rounded" />
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

      {/** Eventos */}
      {/** Modal de edición */}
      <Dialog open={isModalOpen} onClose={cerrarModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingTrip ? 'Editar Incidencia' : ''}
            </Dialog.Title>
            <AdminTripsForm
              initialData={editingTrip}
              onEditar={handleEditarSubmit}
              isEditing={!!editingTrip}
              token={session.accessToken}
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/** Modal de confirmación */}
      {showConfirm && (
        <ConfirmModal
            message = "¿Seguro que deseas eliminar? Ten en cuenta que una acción irreversible."
            actionType= "eliminar"
            onConfirm={delSolvedTrip}
            onClose={() => setShowConfirm(false)}
            isOpen={showConfirm}
        />
      )}
    </div>
  );
}
