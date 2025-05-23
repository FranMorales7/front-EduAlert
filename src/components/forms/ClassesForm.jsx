'use client';

import { Dialog } from '@headlessui/react';

export default function ClassesSelector({ aula, clases, showModal, setShowModal, onSelect }) {
  return (
    <div>
      <span className="text-gray-700">Aula:</span>
      <div className="flex items-center gap-2">
        <input
          name="aula"
          value={aula}
          readOnly
          className="flex-1 border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
        >
          Elegir
        </button>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Selecciona un aula</Dialog.Title>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {clases.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setShowModal(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                  >
                    {c.location}
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
