'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Mail } from 'lucide-react';

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

      axios
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
    <div className="flex flex-col items-center p-4 max-w-xs bg-white rounded-2xl shadow-blue transition-shadow shadow-md hover:shadow-lg">
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
          <img
            src={fullImageUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </div>

      <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>

      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
        <Mail className="w-4 h-4" />
        <span>{user.email}</span>
      </div>
    </div>
  );
}
