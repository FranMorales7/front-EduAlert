'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeClosed } from 'lucide-react';

export default function TeacherForm({ initialData = null, onSubmit, isEditing = false }) {
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    last_name_1: '',
    last_name_2: '',
    email: '',
    password: '',
    image: '',
    imageFile: null,
    is_active: true,
    is_admin: false,
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (initialData) {
      const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
      const fullImageUrl = initialData.image ? `${imageUrl}storage/${initialData.image}` : '';

      setFormData({
        name: initialData.name || '',
        last_name_1: initialData.last_name_1 || '',
        last_name_2: initialData.last_name_2 || '',
        email: initialData.email || '',
        password: initialData.password || '',
        image: fullImageUrl,
        imageFile: null,
        is_active: initialData.is_active ?? true,
        is_admin: initialData.is_admin ?? false,
        created_at: initialData.created_at || '',
        updated_at: initialData.updated_at || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.imageFile) {
      const objectUrl = URL.createObjectURL(formData.imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [formData.imageFile]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor a 2MB.');
      return;
    }

    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    ['name', 'last_name_1', 'last_name_2', 'email'].forEach((field) => {
      if (formData[field]) data.append(field, formData[field]);
    });

    if (formData.password) {
      data.append('password', formData.password);
    }

    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    data.append('is_admin', formData.is_admin ? true : false); 
    data.append('is_active', formData.is_active ? true : false);

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Editar Docente' : 'Crear Docente'}
      </h2>

      <div className="flex justify-center">
        <Image
          src={preview || formData.image || '/images/Avatar_m_2.jpg'}
          alt="Foto de perfil"
          sizes='64px'
          width={100}
          height={100}
          className="rounded-full ring ring-blue-500 object-cover"
          style={{ width: '100px', height: '100px' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Primer apellido</label>
          <input
            type="text"
            name="last_name_1"
            value={formData.last_name_1}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Segundo apellido</label>
          <input
            type="text"
            name="last_name_2"
            value={formData.last_name_2}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="block text-sm font-medium text-gray-700 mt-4">
        <label htmlFor="new_password">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Ingresar contraseña"}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            className="absolute right-0 bottom-2 top-0 h-full px-2"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye className="-my-1" /> : <EyeClosed className="-my-1" />}
          </button>
        </div>
      </div>

      <div className="flex items-start">
        <label className="text-sm font-medium text-gray-700" htmlFor="is_active">¿Activo?</label>
        <label className="relative inline-flex ml-4 items-center cursor-pointer">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-200"></div>
        </label>
      </div>

      <div className="flex items-start mt-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="is_admin">¿Es administrador?</label>
        <label className="relative inline-flex ml-4 items-center cursor-pointer">
          <input
            type="checkbox"
            id="is_admin"
            name="is_admin"
            checked={formData.is_admin}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-200"></div>
        </label>
      </div>

      {isEditing && (
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Creado: {formData.created_at?.slice(0, 10)}</span>
          <span>Última modificación: {formData.updated_at?.slice(0, 10)}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {isEditing ? 'Guardar cambios' : 'Crear Docente'}
      </button>
    </form>
  );
}
