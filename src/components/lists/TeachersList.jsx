import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherSelector({ open, onClose, onSelect, token }) {
  const [teachers, setTeachers] = useState([]);
  const [filtros, setFiltros] = useState({
    name: '',
    last_name_1: '',
    last_name_2: '',
  });

  useEffect(() => {
    if (!open || !token) return;

    const fetchProfesores = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error('Error al cargar profesores', err);
      }
    };

    fetchProfesores();
  }, [open, token]);

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const profesoresFiltrados = teachers.filter((a) =>
    (a.name || '').toLowerCase().includes(filtros.name.toLowerCase()) &&
    (a.last_name_1 || '').toLowerCase().includes(filtros.last_name_1.toLowerCase()) &&
    (a.last_name_2 || '').toLowerCase().includes(filtros.last_name_2.toLowerCase()) 
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-end p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg rounded">
          <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un profesor/a</Dialog.Title>

          <div className="space-y-2 mb-4">
            {[
              { label: 'Nombre', key: 'name' },
              { label: 'Primer Apellido', key: 'last_name_1' },
              { label: 'Segundo Apellido', key: 'last_name_2' },
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
            {profesoresFiltrados.map((a) => (
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
                </button>
              </li>
            ))}
            {profesoresFiltrados.length === 0 && (
              <li className="text-sm text-gray-400 text-center py-4">No se encontraron profesores.</li>
            )}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}