'use client';

import { useEffect, useState } from 'react';
import useAuthUser from '@/hooks/useAuthUser';
import { getAllStudents } from '@/requests/students';
import { getAllLessons } from '@/requests/lessons';
import ClassesSelector from '../lists/ClassesList';
import StudentsSelector from '../lists/StudentsList';
import SolvedToggleButton from '../ui/solvedToogledButton';
import toast from 'react-hot-toast';

export default function AdminIncidentsForm({ initialData, onCrear, onEditar, isEditing, token }) {
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
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuthUser();

  useEffect(() => {
    if (initialData) {
      setForm({
        descripcion: initialData.descripcion || '',
        fecha: initialData.fecha || '',
        aula: initialData.aula || '',
        alumno: initialData.alumno || '',
        student_id: initialData.student_id || null,
        lesson_id: initialData.lesson_id || null,
        is_solved: initialData.is_solved || false,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (user?.accessToken && showAlumnoModal) {
      const controller = new AbortController();
      getAllStudents(session.accessToken, controller.signal)
        .then((res) => setAlumnos(res.data))
        .catch((err) => {
          if (err.name !== 'CanceledError') {
            console.error('Error al cargar alumnos', err);
            toast.error('Error al mostrar al alumnado');
          }
        });
      return () => controller.abort();
    }
  }, [showAlumnoModal, user]);

  useEffect(() => {
    if (user?.accessToken && showClaseModal) {
      const controller = new AbortController();
      getAllLessons(session.accessToken, controller.signal)
        .then((res) => setClases(res.data))
        .catch((err) => {
          if (err.name !== 'CanceledError') {
            console.error('Error al cargar clases', err);
            toast.error('Error al mostrar las clases');
          }
        });
      return () => controller.abort();
    }
  }, [showClaseModal, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarClase = (clase) => {
    setForm((prev) => ({
      ...prev,
      aula: clase.location,
      lesson_id: clase.id,
    }));
    setShowClaseModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const data = {
      id: initialData?.id,
      description: form.descripcion,
      created_at: form.fecha,
      student_id: form.student_id,
      lesson_id: form.lesson_id,
      ...(isEditing ? { is_solved: form.is_solved } : { teacher_id: user.id }),
    };

    if (isEditing && onEditar) {
      onEditar(data);
    } else if (!isEditing && onCrear) {
      onCrear(data);
    }
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
    {isEditing ? (
      <>
        <Input label="Descripción" name="descripcion" value={form.descripcion} readOnly />
        <Input label="Alumno" name="alumno" value={form.alumno} readOnly />
        <Input label="Fecha" name="fecha" value={form.fecha} type="date" readOnly />
        <Input label="Aula" name="aula" value={form.aula} readOnly />

        <div>
          <span className="text-gray-700 mr-4">Estado:</span>
          <SolvedToggleButton 
            value={form.is_solved}
            onChange={(newValue) =>
              setForm((prev) => ({ ...prev, is_solved: newValue }))
            }
          />
        </div>
      </>
    ) : (
      <>
        <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />
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

          <StudentsSelector
            open={showAlumnoModal}
            onClose={() => setShowAlumnoModal(false)}
            onSelect={(a) =>
              setForm((prev) => ({
                ...prev,
                alumno: `${a.name} ${a.last_name_1}`,
                student_id: a.id,
              }))
            }
            token={user?.accessToken}
          />
        </div>

        <Input label="Fecha" type="date" name="fecha" value={form.fecha} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium">Ubicación</label>
          <ClassesSelector
            aula={form.aula}
            clases={clases}
            showModal={showClaseModal}
            setShowModal={setShowClaseModal}
            onSelect={seleccionarClase}
            token={token}
          />
        </div>
      </>
    )}

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      {isEditing ? 'Guardar estado' : 'Crear'}
    </button>
  </form>
  );

}

function Input({ label, name, value, onChange, type = 'text', readOnly = false }) {
  return (
    <div>
      <span className="text-gray-700">{label}:</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full border px-3 py-2 rounded ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}