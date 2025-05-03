'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/not_logged/login');
  }, [router]);

  return null; // no se necesita renderizar nada
}
