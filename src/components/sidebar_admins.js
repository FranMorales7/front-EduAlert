'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Bell, Home, LogOutIcon, Settings, ThumbsDown, Toilet } from 'lucide-react'; // Puedes usar lucide-react o tus propios íconos
import Image from 'next/image';
import logo from '../../public/images/SF_logo.png'; 
import UserCard from './UserCard';
import { signOut } from 'next-auth/react';


export default function Sidebar() {
  const pathname = usePathname();
  
    const links = [
      { href: '/logged/manager/inicio', label: 'Inicio', icon: <Home size={20} /> },
      { href: '/logged/manager/avisos', label: 'Avisos', icon: <Bell size={20} /> },
      { href: '/logged/manager/incidencias', label: 'Incidencias', icon: <ThumbsDown size={20} /> },
      { href: '/logged/manager/salidas', label: 'Salidas', icon: <Toilet size={20} /> },
      { href: '/logged/manager/alumnado', label: 'Estudiantes', icon: <PiStudentFill size={20} /> },
      { href: '/logged/manager/profesorado', label: 'Profesores', icon: <GiTeacher size={20} /> },
      { href: '/logged/manager/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
    ];
  
    return (
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg flex flex-col justify-between p-4 border-r border-gray-200 z-30">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src={logo} alt="EduAlert Logo" width={110} height={110} className="mb-1" />
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
