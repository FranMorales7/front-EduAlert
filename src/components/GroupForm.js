'use client';

import { useState, useEffect } from 'react';

export default function GroupForm({ initialData = null, onCrear, onEditar, isEditing = false, tutores = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    tutor_id: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        tutor_id: initialData.tutor_id || '',
      });
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
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tutor</label>
        <select
          name="tutor_id"
          value={formData.tutor_id}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        >
          <option value="">-- Seleccionar tutor --</option>
          {tutores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
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
