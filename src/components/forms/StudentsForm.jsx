import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import GroupsSelector from '../lists/GroupsList';
import toast from 'react-hot-toast';

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
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!showGrupoModal || !session?.accessToken) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchGrupos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          signal: controller.signal,
        });
        setGrupos(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Error al cargar grupos', err);
          toast.error('Error al obtener la información de los grupos')
        }
      }
    };

    fetchGrupos();
  }, [showGrupoModal, session?.accessToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
      setForm({ ...form, [name]: value });
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
            Asignar
          </button>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isEditing ? 'Guardar cambios' : 'Crear Estudiante'}
      </button>

      {/* Modal de selección de grupo */}
      <GroupsSelector 
        open={showGrupoModal}
        onClose={() => setShowGrupoModal(false)}
        onSelect={seleccionarGrupo}
        token={session?.accessToken}
      />
    </form>
  );
}
