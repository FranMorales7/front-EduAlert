'use client';

import { useState, useEffect } from 'react';
import ClassesSelector from '../lists/ClassesList';
import TeacherSelector from '../lists/TeachersList';

export default function GroupForm({
  initialData = null,
  onCrear,
  onEditar,
  isEditing = false,
  tutores = [],
  clases = [], 
  token = ''
}) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    tutor_id: '',
  });

  const [showClassSelector, setShowClassSelector] = useState(false);
  const [showTeacherSelector, setShowTeacherSelector] = useState(false);
  const [selectedTutorName, setSelectedTutorName] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        tutor_id: initialData.tutor_id || '',
      });
      if (initialData.tutor) {
        const { name, last_name_1, last_name_2 } = initialData.tutor;
        setSelectedTutorName(`${name} ${last_name_1} ${last_name_2 || ''}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      location: formData.location,
      tutor_id: formData.tutor_id || null,
    };
    if (isEditing) {
      await onEditar({ data, id: initialData.id });
    } else {
      await onCrear(data);
    }
  };

  const handleClassSelect = (clase) => {
    setFormData((prev) => ({ ...prev, location: clase.location }));
  };

  const handleTutorSelect = (tutor) => {
    setFormData((prev) => ({ ...prev, tutor_id: tutor.id }));
    setSelectedTutorName(`${tutor.name} ${tutor.last_name_1} ${tutor.last_name_2 || ''}`);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">{isEditing ? 'Editar Grupo' : 'Crear Grupo'}</h2>

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Ubicación</label>
        <ClassesSelector
          aula={formData.location}
          clases={clases}
          showModal={showClassSelector}
          setShowModal={setShowClassSelector}
          onSelect={handleClassSelect}
        />
      </div>

      <div>
          <label className="block text-sm font-medium">Tutor</label>
          <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedTutorName}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowTeacherSelector(true)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
          >
            Elegir
          </button>
        </div>
        <TeacherSelector
          open={showTeacherSelector}
          onClose={() => setShowTeacherSelector(false)}
          onSelect={handleTutorSelect}
          token={token}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isEditing ? 'Guardar cambios' : 'Crear Grupo'}
      </button>
    </form>
  );
}
