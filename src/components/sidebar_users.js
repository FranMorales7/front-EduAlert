import Link from 'next/link';
import { PiStudentFill } from "react-icons/pi";
import { Bell, Home, LogOutIcon, Settings, ThumbsDownIcon, ToiletIcon, User } from 'lucide-react'; // Puedes usar lucide-react o tus propios íconos
import Image from 'next/image';
import logo from '../../public/images/SF_logo.png'; 
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md p-4 md:relative z-20">
      <h2 className="mx-8 text-xl font-bold mb-6">
      <Image src={logo} alt="Logo" width={100} height={100} />
      </h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/logged/teacher/inicio" className="flex items-center gap-2 hover:text-blue-600">
          <Home size={20} /> Inicio
        </Link>
        <Link href="/logged/teacher/avisos" className="flex items-center gap-2 hover:text-blue-600">
          <Bell size={20} /> Avisos
        </Link>
        <Link href="/logged/teacher/incidencias" className="flex items-center gap-2 hover:text-blue-600">
          <ThumbsDownIcon size={20} /> Incidencias
        </Link>
        <Link href="/logged/teacher/salidas" className="flex items-center gap-2 hover:text-blue-600">
          <ToiletIcon size={20} /> Salidas
        </Link>
        <Link href="/logged/teacher/configuracion" className="flex items-center gap-2 hover:text-blue-600">
          <Settings size={20} /> Configuración
        </Link>
        <Link href="/logged/teacher/perfil" className="flex items-center gap-2 hover:text-blue-600">
          <User size={20} /> Mi perfil
        </Link>
        <button onClick={() => signOut({ callbackUrl:'/not_logged/login' })} className="flex cursor-pointer items-center gap-2 hover:text-blue-600">
          <LogOutIcon size={20} /> Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
