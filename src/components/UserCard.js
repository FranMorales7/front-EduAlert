'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/api/axios';
import { Mail } from 'lucide-react'; // ícono opcional

export default function UserCard() {
  const abortControllerRef = useRef(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const idUser = session.user.id;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      api
        .get(`${backendUrl}/users/${idUser}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          signal: controller.signal,
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          if (error.name !== 'CanceledError') {
            console.error('Error al obtener el usuario:', error);
          }
        });
    }
  }, [session, status]);

  if (!user) return null;

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const fullImageUrl = user.image ? `${imageUrl}storage/${user.image}` : '/images/Avatar_m_2.jpg';

  return (
    <div className="flex items-center p-2 max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img
          src={fullImageUrl}
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full object-cover border-4 border-blue-500 shadow-sm"
        />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      <div className="ml-3 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}
