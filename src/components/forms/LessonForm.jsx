'use client';

import { useState, useEffect } from 'react';
import TeacherSelector from '../lists/TeachersList';
import GroupsSelector from '../lists/GroupsList';

export default function LessonForm({
  initialData = null,
  onCrear,
  onEditar,
  isEditing = false,
  token,
}) {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    teacher_id: '',
    group_id: '',
    day: '',
    starts_at: '',
    ends_at: '',
  });
  
  const [showTeacherSelector, setShowTeacherSelector] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        location: initialData.location || '',
        teacher_id: initialData.teacher_id || '',
        group_id: initialData.group_id || '',
        day: initialData.day || '',
        starts_at: initialData.starts_at || '',
        ends_at: initialData.ends_at || '',
      });

      if (initialData.group) setSelectedGroup(initialData.group);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.teacher) {
      setSelectedTeacher(initialData.teacher);
    }
  }, [initialData]);

  const handleTeacherSelect = (teacher) => {
    setFormData((prev) => ({ ...prev, teacher_id: teacher.id }));
    setSelectedTeacher(`${teacher.name || 'Sin profesor'} ${teacher.last_name_1} ${teacher.last_name_2 || ''}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      description: formData.description || null,
      location: formData.location || null,
      teacher_id: formData.teacher_id || null,
      group_id: formData.group_id || null,
      day: formData.day || null,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null,
    };
    if (isEditing) {
      await onEditar({ data, id: initialData.id });
    } else {
      await onCrear(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">{isEditing ? 'Editar Clase' : 'Crear Clase'}</h2>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Ubicación</label>
        <div className="flex items-center gap-2">

        </div>
        <GroupsSelector
        open={showGroupSelector}
        onClose={() => setShowGroupSelector(false)}
        onSelect={(group) => {
          setSelectedGroup(group);
          setFormData((prev) => ({ ...prev, group_id: group.id }));
        }}
        token={token}
      />
      </div>

      <div>
        <label className="block text-sm font-medium">Profesor/a</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedTeacher}
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
          onSelect={handleTeacherSelect}
          token={token}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Grupo</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={selectedGroup}
            readOnly
            className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={() => setShowGroupSelector(true)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
          >
            Elegir
          </button>
        </div>
        <GroupsSelector
          open={showGroupSelector}
          onClose={() => setShowGroupSelector(false)}
          onSelect={(group) => {
            setSelectedGroup(group);
            setFormData((prev) => ({ ...prev, group_id: group.id }));
          }}
          token={token}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Día de la semana (1-5)</label>
        <input
          type="number"
          name="day"
          min="1"
          max="5"
          value={formData.day}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Hora de inicio</label>
        <input
          type="time"
          name="starts_at"
          value={formData.starts_at}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Hora de fin</label>
        <input
          type="time"
          name="ends_at"
          value={formData.ends_at}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isEditing ? 'Guardar cambios' : 'Crear Clase'}
      </button>

    </form>
  );
}
