import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmModal from './confirmModal';

export default function DeleteButton({ onClick }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    onClick(); // Ejecuta la función pasada después de confirmar
    setShowConfirm(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="btDelete"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>

      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
          message="¿Seguro que deseas eliminar? Esta acción es irreversible."
          actionType="eliminar"
        />
      )}
    </>
  );
}
