'use client'
import BlurBackground from "@/components/BlurBackground";
import Header from "@/components/header";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Configuration() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/not_logged/login');
    }
  }, [status, router]);

  if (status === 'loading') return <div>Cargando...</div>;
  return (
    <BlurBackground className="">
      <Header />A continuación se muestra tu horario para hoy.
    </BlurBackground>
  );
}
