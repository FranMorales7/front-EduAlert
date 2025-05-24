'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createClassRooms, deleteClassRooms, getAllClassRooms, updateClassRooms } from '@/requests/classRooms';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';

export default function ClassRoomsTable() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchClassRooms = async () => {
    try {
      const res = await getAllClassRooms(token);
      setClassRooms(res.data);
    } catch (error) {
      console.error('Error al obtener las aulas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createClassRooms({ name: newName }, token);
      setNewName('');
      fetchClassRooms();
    } catch (error) {
      console.error('Error creando aula:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClassRooms(id, token);
      fetchClassRooms();
    } catch (error) {
      console.error('Error eliminando aula:', error);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return;
    try {
      await updateClassRooms(editId, { name: editName }, token);
      setEditId(null);
      setEditName('');
      fetchClassRooms();
    } catch (error) {
      console.error('Error modifcando aula:', error);
    }
  };

  useEffect(() => {
    if (token) fetchClassRooms();
  }, [token]);

  if (loading) return <div>Cargando aulas...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded inset-shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Administración de Aulas</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del aula"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </div>

      <ul className="space-y-2 max-h-[500px] overflow-y-auto">
        {classRooms.map((aula) => (
          <li
            key={aula.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            {editId === aula.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border px-2 py-1 mr-2 rounded"
                />
                <button
                  onClick={handleUpdate}
                  className="btSuccess"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="btDelete"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span>{aula.name}</span>
                <div className="flex gap-2">
                  <EditButton
                    onClick={() => handleEdit(aula.id, aula.name)}
                  />

                  <DeleteButton
                    onClick={() => handleDelete(aula.id)}
                  />
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
