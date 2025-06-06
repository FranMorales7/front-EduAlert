'use client'
import BlurBackground from "@/components/ui/BlurBackground";
import Header from "@/components/ui/header";
import Schedule from "@/components/ui/schedule";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Index() {
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
