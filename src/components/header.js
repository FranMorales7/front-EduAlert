'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState(null);

  // Cuando ya se tiene la sesión, mostramos el nombre del usuario
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log(session.user.name)
      setUser(session.user.name);
    }
  }, [session, status]);

  return (
    <div className="text-lg font-semibold flex">
      {user ? `Bienvenid@ ${user} ` : 'Bienvenid@'}
    </div>
  );
}
