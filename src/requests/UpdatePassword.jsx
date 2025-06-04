import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function UpdatePassword({ currentPassword, newPassword, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordB, setShowPasswordB] = useState(false);

  return (
    <>
      <div className="block text-sm font-medium text-gray-700">
        <p className="text-sm text-gray-600 italic">
          Para cambiar tu contraseña, debes ingresar tu contraseña actual y la nueva contraseña.
        </p>
        <label htmlFor="current_password">Contraseña actual</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="current_password"
            value={currentPassword}
            onChange={onChange}
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

      <div className="block text-sm font-medium text-gray-700 mt-4">
        <label htmlFor="new_password">Nueva contraseña</label>
        <div className="relative">
          <input
            type={showPasswordB ? 'text' : 'password'}
            name="new_password"
            value={newPassword}
            onChange={onChange}
            placeholder="Dejar en blanco para mantener la actual"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            className="absolute right-0 bottom-2 top-0 h-full px-2"
            onClick={() => setShowPasswordB((prev) => !prev)}
          >
            {showPasswordB ? <Eye className="-my-1" /> : <EyeClosed className="-my-1" />}
          </button>
        </div>
      </div>
    </>
  );
}
