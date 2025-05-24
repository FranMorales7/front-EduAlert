import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GroupsSelector({ open, onClose, onSelect, token }) {
  const [groups, setGroups] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!open || !token) return;

    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(res.data);
      } catch (err) {
        console.error('Error al cargar grupos', err);
      }
    };

    fetchGroups();
  }, [open, token]);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-end p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg rounded">
          <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un grupo</Dialog.Title>

          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4"
          />

          <ul className="space-y-2 max-h-[60vh] overflow-y-auto border-t pt-2">
            {filteredGroups.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(g);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                >
                  {g.name}
                </button>
              </li>
            ))}
            {filteredGroups.length === 0 && (
              <li className="text-sm text-gray-400 text-center py-4">No se encontraron grupos.</li>
            )}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
