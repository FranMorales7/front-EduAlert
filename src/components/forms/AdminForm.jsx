'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import UpdatePassword from '../../requests/UpdatePassword';
import { updatePassword } from '@/requests/authentication';
import toast from 'react-hot-toast';

export default function AdminForm() {
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    last_name_1: '',
    last_name_2: '',
    email: '',
    current_password: '',
    new_password: '',
    image: '',
    imageFile: null,
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user.id);
    }
  }, [session, status]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!user) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    axios
      .get(`${backendUrl}/users/${user}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((resp) => {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
        const data = resp?.data || {};
        const fullImageUrl = data.image ? `${imageUrl}storage/${data.image}?t=${Date.now()}` : '';
        setFormData({
          name: data.name ?? '',
          last_name_1: data.last_name_1 ?? '',
          last_name_2: data.last_name_2 ?? '',
          email: data.email ?? '',
          password: '',
          image: fullImageUrl,
          imageFile: null,
          created_at: data.created_at ?? '',
          updated_at: data.updated_at ?? '',
        });
        setIsLoading(false);

      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          toast.error('Error en la infromación del usuario')
          console.error('Error al traer información sobre el usuario:', error);
        }
      });

    return () => controller.abort();
  }, [user, session, status]);

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 2MB.');
      return;
    }

    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const form = new FormData();

    ['name', 'last_name_1', 'last_name_2', 'email'].forEach((field) => {
      if (formData[field]) form.append(field, formData[field]);
    });

    if (formData.new_password && formData.current_password) {
      try {
        await updatePassword(
          {
            current_password: formData.current_password,
            new_password: formData.new_password,
            new_password_confirmation: formData.new_password,
          },
          session.accessToken
        );
        toast.success('Contraseña cambiada con éxito');
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error.response?.data || error.message);
        toast.error('Error al actualizar contraseña');
        return;
      }
    }

    if (formData.imageFile) {
      form.append('image', formData.imageFile);
    }

    try {
      const resp = await axios.put(`${backendUrl}/users/${user}`, form, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: resp?.data?.image ? `${backendUrl}/storage/${resp.data.image}?t=${Date.now()}` : '',
        imageFile: null,
        password: '',
        current_password: '',
        new_password: '',
      }));

      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error actualizando perfil');
    }
  };

  if (isLoading) return <p>Cargando datos del usuario...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl inset-shadow-md shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mi perfil</h2>

      <div className="flex justify-center">
        <Image
          src={preview || formData.image || '/images/SF_logo-fa.png'}
          alt="Foto de perfil"
          sizes='64px'
          width={100}
          height={100}
          className="rounded-full ring ring-blue-500 object-cover"
          style={{ width: '100px', height: '100px' }}
        />

      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cambiar imagen de perfil</label>
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
          />
        </div>
      </div>

      <UpdatePassword 
        value={formData.password}
        onChange={handleChange} 
      />

      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Creado: {formData.created_at?.slice(0, 10)}</span>
        <span>Última modificación: {formData.updated_at?.slice(0, 10)}</span>
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Guardar cambios
      </button>
    </form>
  );
}
