import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentsSelector({ open, onClose, onSelect, token }) {
  const [alumnos, setAlumnos] = useState([]);
  const [filtros, setFiltros] = useState({
    name: '',
    last_name_1: '',
    last_name_2: '',
    group: '',
  });

  useEffect(() => {
    if (!open || !token) return;

    const fetchAlumnos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlumnos(res.data);
      } catch (err) {
        console.error('Error al cargar alumnos', err);
      }
    };

    fetchAlumnos();
  }, [open, token]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const alumnosFiltrados = alumnos.filter((a) =>
    (a.name || '').toLowerCase().includes(filtros.name.toLowerCase()) &&
    (a.last_name_1 || '').toLowerCase().includes(filtros.last_name_1.toLowerCase()) &&
    (a.last_name_2 || '').toLowerCase().includes(filtros.last_name_2.toLowerCase()) &&
    (a.group?.name || '').toLowerCase().includes(filtros.group.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-end p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg rounded">
          <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un alumno</Dialog.Title>

          <div className="space-y-2 mb-4">
            {[
              { label: 'Nombre', key: 'name' },
              { label: 'Primer Apellido', key: 'last_name_1' },
              { label: 'Segundo Apellido', key: 'last_name_2' },
              { label: 'Grupo', key: 'group' },
            ].map(({ label, key }) => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={`Filtrar por ${label}`}
                value={filtros[key]}
                onChange={handleFiltro}
                className="w-full px-3 py-2 border rounded"
              />
            ))}
          </div>

          <ul className="space-y-2 max-h-[60vh] overflow-y-auto border-t pt-2">
            {alumnosFiltrados.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(a);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                >
                  {a.name} {a.last_name_1} {a.last_name_2}
                  {a.group?.name && (
                    <span className="block text-sm text-amber-100">Grupo: {a.group.name}</span>
                  )}
                </button>
              </li>
            ))}
            {alumnosFiltrados.length === 0 && (
              <li className="text-sm text-gray-400 text-center py-4">No se encontraron alumnos.</li>
            )}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}