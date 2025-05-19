import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';

export default function StudentForm({ initialData, onCrear, onEditar, isEditing }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    nacimiento: '',
    contacto: '',
    grupo: '',
    group_id: null,
    imagen: null,
  });

  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [showGrupoModal, setShowGrupoModal] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.name || '',
        apellido1: initialData.last_name_1 || '',
        apellido2: initialData.last_name_2 || '',
        nacimiento: initialData.birthdate || '',
        contacto: initialData.contact || '',
        grupo: initialData.group?.name || '',
        group_id: initialData.group?.id || null,
        imagen: null, // No se previsualiza ni envía imagen existente en edición
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!showGrupoModal || !session?.user?.accessToken) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchGrupos = async () => {
      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          signal: controller.signal,
        });
        setGrupos(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Error al cargar grupos', err);
        }
      }
    };

    fetchGrupos();
  }, [showGrupoModal, session?.user?.accessToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const seleccionarGrupo = (grupo) => {
    setForm({
      ...form,
      grupo: grupo.name,
      group_id: grupo.id,
    });
    setShowGrupoModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.nombre);
    data.append('last_name_1', form.apellido1);
    if (form.apellido2) data.append('last_name_2', form.apellido2);
    data.append('birthdate', form.nacimiento);
    data.append('contact', form.contacto);
    data.append('group_id', form.group_id);
    if (form.imagen) data.append('image', form.imagen);

    if (isEditing && initialData?.id) {
        onEditar({ data, id: initialData.id }); 
    } else {
        onCrear(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div>
        <span className="text-gray-700">Nombre:</span>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <span className="text-gray-700">Primer Apellido:</span>
        <input
          name="apellido1"
          value={form.apellido1}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <span className="text-gray-700">Segundo Apellido:</span>
        <input
          name="apellido2"
          value={form.apellido2}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <span className="text-gray-700">Fecha de nacimiento:</span>
        <input
          type="date"
          name="nacimiento"
          value={form.nacimiento}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <span className="text-gray-700">Contacto:</span>
        <input
          name="contacto"
          value={form.contacto}
          onChange={handleChange}
          placeholder="Teléfono o email de contacto"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <span className="text-gray-700">Grupo:</span>
        <div className="flex items-center gap-2">
          <input
            name="grupo"
            value={form.grupo}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowGrupoModal(true)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
          >
            Elegir
          </button>
        </div>
      </div>

      <div>
        <span className="text-gray-700">Imagen (opcional):</span>
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isEditing ? 'Guardar cambios' : 'Crear Estudiante'}
      </button>

      {/* Modal de selección de grupo */}
      <Dialog open={showGrupoModal} onClose={() => setShowGrupoModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un grupo</Dialog.Title>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {grupos.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => seleccionarGrupo(g)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                  >
                    {g.name}
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </form>
  );
}
