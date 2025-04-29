import Link from 'next/link';
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Bell, Home, Settings, User } from 'lucide-react'; // Puedes usar lucide-react o tus propios íconos
import Image from 'next/image';
import logo from '../../public/images/SF_logo.png'; 

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 fixed md:relative z-20">
      <h2 className="mx-8 text-xl font-bold mb-6">
      <Image src={logo} alt="Logo" width={100} height={100} />
      </h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/logged/manager/" className="flex items-center gap-2 hover:text-blue-600">
          <Home size={20} /> Inicio
        </Link>
        <Link href="/logged/manager/avisos" className="flex items-center gap-2 hover:text-blue-600">
          <Bell size={20} /> Avisos
        </Link>
        <Link href="/logged/manager/alumnado" className="flex items-center gap-2 hover:text-blue-600">
          <PiStudentFill size={20} /> Estudiantes
        </Link>
        <Link href="/logged/manager/profesorado" className="flex items-center gap-2 hover:text-blue-600">
          <GiTeacher size={20} /> Profesores
        </Link>
        <Link href="/logged/manager/configuracion" className="flex items-center gap-2 hover:text-blue-600">
          <Settings size={20} /> Configuración
        </Link>
        <Link href="/logged/manager/perfil" className="flex items-center gap-2 hover:text-blue-600">
          <User size={20} /> Mi perfil
        </Link>
      </nav>
    </aside>
  );
}
