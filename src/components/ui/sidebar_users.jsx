'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  LogOutIcon,
  Settings,
  ThumbsDownIcon,
  ToiletIcon,
} from 'lucide-react';
import Image from 'next/image';
import logo from '/public/images/SF_logo.png';
import { signOut } from 'next-auth/react';
import UserCard from '../cards/UserCard';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/logged/teacher/inicio', label: 'Inicio', icon: <Home size={20} /> },
    { href: '/logged/teacher/avisos', label: 'Avisos', icon: <Bell size={20} /> },
    { href: '/logged/teacher/incidencias', label: 'Incidencias', icon: <ThumbsDownIcon size={20} /> },
    { href: '/logged/teacher/salidas', label: 'Salidas', icon: <ToiletIcon size={20} /> },
    { href: '/logged/teacher/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg flex flex-col justify-between p-4 border-r border-gray-200 z-30">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <Image src="/public/images/SF_logo.png" alt="EduAlert Logo" width={110} height={110} className="mb-1" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4 text-sm font-medium px-2">
        {links.map((link, index) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={index}
              href={link.href}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: '/not_logged/login' })}
          className="cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOutIcon size={20} />
          <span>Cerrar sesión</span>
        </button>
      </nav>

      {/* User Card */}
      <div className="mt-auto pt-6">
        <UserCard />
      </div>
    </aside>
  );
}
