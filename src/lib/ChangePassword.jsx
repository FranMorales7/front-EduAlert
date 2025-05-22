'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { updatePassword } from '@/requests/authentication';

export default function ChangePassword() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setMensaje(null);

    try {
      await updatePassword(formData, session.user.accessToken);
      setMensaje('Contraseña actualizada exitosamente.');
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Error al cambiar contraseña.';
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Cambiar contraseña</h2>

      <div>
        <label className="block text-sm text-gray-600">Contraseña actual</label>
        <input
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Nueva contraseña</label>
        <input
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Confirmar nueva contraseña</label>
        <input
          type="password"
          name="new_password_confirmation"
          value={formData.new_password_confirmation}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {cargando ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}
