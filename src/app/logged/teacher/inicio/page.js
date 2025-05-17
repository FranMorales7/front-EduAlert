'use client'
import BlurBackground from "@/components/BlurBackground";
import Header from "@/components/header";
import Schedule from "@/components/schedule";
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
      <Header />
      <h2 className="text-md text-gray-600 ml-4">A continuación se muestra tu horario.</h2>
      <Schedule />
    </BlurBackground>
  );
}
