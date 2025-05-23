import { useSession } from 'next-auth/react';

/* Lógica de autenticación que devuelve el user al completo */
export default function useAuthUser() {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;
  
  return { user, session, status };
}
