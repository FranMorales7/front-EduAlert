'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import UpdatePassword from '../hooks/UpdatePassword';
import { updatePassword } from '@/requests/authentication';
import toast from 'react-hot-toast';

export default function FormularioUsuario() {
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

  // Validaciones
  const allowedDomains = ['com', 'es', 'net', 'org'];

  function isValidEmailDomain(email) {
    const domain = email.split('@')[1]; // Ej: "gmail.com"
    const tld = domain.split('.').pop(); // Ej: "com"
    return allowedDomains.includes(tld);
  }

  function isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
  }

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
      .get(`${backendUrl}/teachers/byUser/${user}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        signal: controller.signal,
      })
      .then((resp) => {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
        const data = resp?.data || {};
        const fullImageUrl = data.image ? `${imageUrl}/storage/${data.image}?t=${Date.now()}` : '';
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
          console.error('Error al traer información sobre el usuario:', error);
          toast.error('Error al obtener información del usuario');
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

    // Validar información antes de enviar
    if (!isValidEmailDomain(formData.email)) {
      toast.error('El correo debe ser de un dominio permitido (.com, .es, .net, .org)');
      return;
    }

    if (formData.new_password) {
      if (!isStrongPassword(formData.new_password)) {
        toast.error('La nueva contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, un número y un símbolo.');
        return;
      }

      if (!formData.current_password) {
        toast.error('Debes ingresar tu contraseña actual para cambiarla.');
        return;
      }
    }

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
        toast.success('COntraseña cambiada correctamente');
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error.response?.data || error.message);
        toast.error('Error actualizando contraseña')
        return;
      }
    }

    if (formData.imageFile) {
      form.append('image', formData.imageFile);
    }

    try {
      const resp = await axios.post(`${backendUrl}/teachers/byUser/${user}`, form, {
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
      
      toast.success('Perfil actualizado con éxito');

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error actualizando perfil');
    }
  };

  if (isLoading) return <p>Cargando datos del usuario...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto -my-10 bg-white p-6 rounded-xl shadow-inset-sm shadow-lg space-y-4 inset-shadow-sm">
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
            className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 italic">
        Para cambiar tu contraseña, debes ingresar la actual también.
      </p>
      <UpdatePassword 
        value={formData.password}
        onChange={handleChange} 
      />
      <p className="text-sm text-gray-600 italic">
        La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un símbolo.
      </p>

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
