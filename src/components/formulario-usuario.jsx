'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import api from '@/api/axios';
import Image from 'next/image';

export default function FormularioUsuario() {
  const abortControllerRef = useRef(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    last_name_1: '',
    last_name_2: '',
    email: '',
    image: '',
    created_at: '',
    updated_at: '',
  });
  const [isLoading, setIsLoading] = useState(true);

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

    api
      .get(`${backendUrl}/teachers/byUser/${user}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((resp) => {
        setFormData({
          name: resp?.data?.name || '',
          last_name_1: resp?.data?.last_name_1 || '',
          last_name_2: resp?.data?.last_name_2 || '',
          email: resp?.data?.email || '',
          image: resp?.data?.image || '',
          created_at: resp?.data?.created_at || '',
          updated_at: resp?.data?.updated_at || '',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          console.error('Error al traer información sobre el usuario:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [user, session, status]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Solo incluir campos válidos y omitimos los no actualizables
    const { email, created_at, updated_at, ...dataToSend } = formData;

    // Eliminar campos opcionales vacíos como image
    Object.keys(dataToSend).forEach((key) => {
      if (dataToSend[key] === '') delete dataToSend[key];
    });

    try {
      await api.put(`${backendUrl}/teachers/byUser/${user}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);

      if (error.response?.status === 422) {
        const errores = error.response.data.errors;
        const mensaje = Object.values(errores).flat().join('\n');
      }
    }
  };

  if (isLoading) return <p>Cargando datos del usuario...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mi perfil</h2>

      <div className="flex justify-center">
        <Image
          src={formData.image || '/images/default-avatar.png'}
          alt="Foto de perfil"
          width={100}
          height={100}
          className="rounded-full ring ring-blue-500"
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
            readOnly
            className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <p className="text-sm text-gray-500 italic">
          Consulta a un administrador para cambiar tu contraseña.
        </p>
      </div>

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
