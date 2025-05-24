'use client';

import { getAllClassRooms } from '@/requests/classRooms';
import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ClassesSelector({ aula, showModal, setShowModal, onSelect, token }) {
  const [classrooms, setClassrooms] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (!showModal || !token) return;

    const fetchClassrooms = async () => {
      try {
        const res = await getAllClassRooms(token);
        setClassrooms(res.data);
      } catch (err) {
        console.error('Error al cargar aulas:', err);
        toast.error('Error al mostrar listado de clases');
      }
    };

    fetchClassrooms();
  }, [showModal, token]);

  const filteredClassrooms = classrooms.filter((c) =>
    (c.name || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          name="aula"
          value={aula || ''}
          readOnly
          className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
        >
          Elegir
        </button>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg rounded">
            <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un aula</Dialog.Title>

            <input
              type="text"
              placeholder="Buscar aula..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <ul className="space-y-2 max-h-[60vh] overflow-y-auto border-t pt-2">
              {filteredClassrooms.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setShowModal(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              {filteredClassrooms.length === 0 && (
                <li className="text-sm text-gray-400 text-center py-4">No se encontraron aulas.</li>
              )}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
