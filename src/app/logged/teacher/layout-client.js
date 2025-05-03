/** Layout del lado cliente **/
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar_users';

export default function ClientLayout({ children }) {
  /** 
   * 1º Identificar si la ruta ha cambiado 
   * 2º Desmontar el <main>
   * 3º Volver a montar el <main> pero con la nueva página
   * **/
  const pathname = usePathname(); 
 
  return (
    <div className="flex w-full">
      <Sidebar />
      <main key={pathname} className="mx-2 w-full min-h-screen p-4">
        {children}
      </main>
    </div>
  );
}
