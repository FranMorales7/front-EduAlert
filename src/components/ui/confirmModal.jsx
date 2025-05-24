'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { XCircle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function ConfirmModal({ message, actionType, onConfirm, onClose, isOpen }) {
  const actionLabel = actionType === 'eliminar' ? 'Eliminar' : 'Editar';
  const actionColor = actionType === 'eliminar' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  const handleConfirm = async () => {
    try {
      await onConfirm(); // Ejecuta la acción pasada como prop
      toast.success(`${actionLabel} realizado correctamente`);
    } catch (error) {
      toast.error(`Error al intentar ${actionLabel.toLowerCase()}`);
      console.error(error.message);
    } finally {
      onClose(); // Cierra el modal
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl relative">
          {/* Título opcional */}
          <Dialog.Title className="text-lg font-semibold mb-4 text-center">
            Confirmación
          </Dialog.Title>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8"
          >
            <XCircle size={25} className='absolute top-1 right-2.5'/>
          </button>

          {/* Mensaje */}
          <div className="mb-6 text-center text-gray-800 text-lg">
            {message}
          </div>

          {/* Boton */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleConfirm}
              className={clsx(
                'px-4 py-2 rounded-xl btDelete',
                actionColor
              )}
            >
              {actionLabel}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
