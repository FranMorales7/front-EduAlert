'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Home, LogOutIcon, Settings, ThumbsDownIcon, ToiletIcon } from 'lucide-react';
import Image from 'next/image';
import logo from '../../public/images/SF_logo.png';
import { signOut } from 'next-auth/react';
import UserCard from './UserCard';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/logged/teacher/inicio', label: 'Inicio', icon: <Home size={20} /> },
    { href: '/logged/teacher/avisos', label: 'Avisos', icon: <Bell size={20} /> },
    { href: '/logged/teacher/incidencias', label: 'Incidencias', icon: <ThumbsDownIcon size={20} /> },
    { href: '/logged/teacher/salidas', label: 'Salidas', icon: <ToiletIcon size={20} /> },
    { href: '/logged/teacher/configuracion', label: 'Configuración', icon: <UserCard /> },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md p-4 md:relative z-20">
      <h2 className="grid grid-flow-col justify-items-center text-xl font-bold mb-6">
        <Image src={logo} alt="Logo" width={100} height={100} />
      </h2>
      <nav className="flex flex-col space-y-4">
        {links.map((link, index) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 ms-6 font-semibold'
                  : 'hover:text-blue-600'
              }`}
            >
              {link.icon} {link.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: '/not_logged/login' })}
          className="flex cursor-pointer items-center gap-2 hover:text-red-600"
        >
          <LogOutIcon size={20} /> Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
