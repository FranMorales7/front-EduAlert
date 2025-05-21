import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';

export default function FormularioAviso({ initialData, onCrear, onEditar, isEditing }) {
  const [form, setForm] = useState({
    descripcion: '',
    fecha: '',
    aula: '',
    alumno: '',
    student_id: null,
    lesson_id: null,
    is_solved: false,
  });

  const [showAlumnoModal, setShowAlumnoModal] = useState(false);
  const [showClaseModal, setShowClaseModal] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [clases, setClases] = useState([]);
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    if (initialData) {
      setForm({
        descripcion: initialData.description || '',
        fecha: initialData.created_at?.slice(0, 10) || '',
        aula: initialData.lesson?.location || '',
        alumno: `${initialData.student?.name ?? ''} ${initialData.student?.last_name_1 ?? ''}`.trim(),
        student_id: initialData.student?.id || null,
        lesson_id: initialData.lesson?.id || null,
        is_solved: initialData.is_solved || false
      });
    }
  }, [initialData]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!user || !showAlumnoModal) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchAlumnos = async () => {
      try {
        const res = await api.get(`${backendUrl}/students`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          signal: controller.signal,
        });
        setAlumnos(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Error al cargar alumnos', err);
        }
      }
    };

    fetchAlumnos();
  }, [showAlumnoModal, user, session?.user?.accessToken]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!user || !showClaseModal) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchClases = async () => {
      try {
        const res = await api.get(`${backendUrl}/lessons`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          signal: controller.signal,
        });
        setClases(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Error al cargar las clases', err);
        }
      }
    };

    fetchClases();
  }, [showClaseModal, user, session?.user?.accessToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const seleccionarAlumno = (alumno) => {
    setForm({
      ...form,
      alumno: `${alumno.name} ${alumno.last_name_1}`,
      student_id: alumno.id,
    });
    setShowAlumnoModal(false);
  };

  const seleccionarClase = (clase) => {
    setForm({
      ...form,
      aula: clase.location,
      lesson_id: clase.id,
    });
    setShowClaseModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: initialData?.id,
      description: form.descripcion,
      created_at: form.fecha,
      student_id: form.student_id,
      lesson_id: form.lesson_id,
      ...(isEditing ? { is_solved: form.is_solved } : { teacher_id: user }),
    };
    isEditing ? onEditar(data) : onCrear(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div> 
        <span className="text-gray-700">Descripción:</span>
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <span className="text-gray-700">Alumno:</span>
        <div className="flex items-center gap-2">
          <input
            name="alumno"
            value={form.alumno}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowAlumnoModal(true)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
          >
            Elegir
          </button>
        </div>
      </div>
      <div>
        <span className="text-gray-700">Fecha:</span>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <span className="text-gray-700">Aula:</span>
        <div className="flex items-center gap-2">
          <input
            name="aula"
            value={form.aula}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowClaseModal(true)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
          >
            Elegir
          </button>
        </div>
      </div>

      {isEditing && (
        <div>
          <span className="text-gray-700">Estado:</span>
          <div className='flex items-center'>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_solved: !form.is_solved })}
            className={`cursor-pointer px-4 py-2 rounded font-semibold text-white transition-colors duration-200 ${
              form.is_solved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {form.is_solved ? 'Resuelta' : 'Sin Resolver'}
          </button>
          </div>
        </div>
      )}

      <button type="submit" className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isEditing ? 'Guardar cambios' : 'Crear'}
      </button>

      {/* Modal de selección de alumno */}
      <Dialog open={showAlumnoModal} onClose={() => setShowAlumnoModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un alumno</Dialog.Title>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {alumnos.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => seleccionarAlumno(a)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                  >
                    {a.name} {a.last_name_1} {a.last_name_2}
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal de selección de clase */}
      <Dialog open={showClaseModal} onClose={() => setShowClaseModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un aula</Dialog.Title>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {clases.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => seleccionarClase(c)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                  >
                    {c.location}
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
