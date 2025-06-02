'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  createClassRooms,
  deleteClassRooms,
  getAllClassRooms,
  updateClassRooms,
} from '@/requests/classRooms';
import EditButton from '../ui/editButton';
import DeleteButton from '../ui/deleteButton';
import toast from 'react-hot-toast';

export default function ClassRoomsTable() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchClassRooms = async () => {
    try {
      const res = await getAllClassRooms(token);
      setClassRooms(res.data);
    } catch (error) {
      console.error('Error al obtener las aulas:', error);
      toast.error('Error al obtener las aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createClassRooms({ name: newName }, token);
      setNewName('');
      setShowCreateForm(false);
      fetchClassRooms();
      toast.success('Aula creada correctamente');
    } catch (error) {
      console.error('Error creando aula:', error);
      toast.error('Error en la creación del aula');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClassRooms(id, token);
      fetchClassRooms();
      toast.success('Aula eliminada con éxito');
    } catch (error) {
      console.error('Error eliminando aula:', error);
      toast.error('Error al eliminar el aula');
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
      console.error('Error modificando aula:', error);
    }
  };

  useEffect(() => {
    if (token) fetchClassRooms();
  }, [token]);

  const filteredClassRooms = classRooms.filter((aula) =>
    aula.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Cargando aulas...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Administración de Aulas</h2>

      {/* Toggle Formulario Crear Aula */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900"
        >
          {showCreateForm ? 'Ocultar formulario' : 'Crear nueva aula'}
        </button>

        {showCreateForm && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Nombre del aula"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-md"
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear
            </button>
          </div>
        )}
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar aula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Lista de aulas */}
      <ul className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredClassRooms.length > 0 ? (
          filteredClassRooms.map((aula) => (
            <li
              key={aula.id}
              className="flex items-center justify-between border px-4 py-3 rounded-md shadow-sm"
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
                    className="text-green-600 hover:underline"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-red-600 hover:underline"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span>{aula.name}</span>
                  <div className="flex gap-2">
                    <EditButton onClick={() => handleEdit(aula.id, aula.name)} />
                    <DeleteButton onClick={() => handleDelete(aula.id)} />
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center py-4">No se encontraron aulas</li>
        )}
      </ul>
    </div>
  );
}
