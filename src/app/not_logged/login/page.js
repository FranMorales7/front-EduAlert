'use client'
import { useState } from 'react';
import api from '../../../api/axios'; // La configuración de axios
import { useRouter } from 'next/navigation';
import logo from '../../../../public/images/CF_logo.png';
import Image from 'next/image';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log('Usuario autenticado:', response?.data);
     
      // Guardamos el token generado en localstorage
      localStorage.setItem('token', response.data.token);

      // Saber si es un admin o un usuario
      const admin = response?.data?.user?.is_admin;

      if(admin){
        router.push('/logged/manager/inicio')
      } else {
        router.push('/logged/teacher/inicio')
      }


    } catch (error) {
      console.error('Error de autenticación', error);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      {/* Contenido en primer plano */}
      <div className="ring-4 ring-blue-500 relative z-10 flex w-4/5 h-4/5 backdrop-blur-md bg-white/60 rounded-xl shadow-xl overflow-hidden">
        
        {/* Lado izquierdo con logo */}
        <div className="ring-2 ring-blue-500/50 w-1/2 flex items-center justify-center bg-white/70">
          <Image src={logo} alt="Logo" width={150} height={150} />
        </div>

        {/* Lado derecho con formulario */}
        <div className="ring-2 ring-blue-500/50 w-1/2 p-8 flex items-center justify-center bg-white/30">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full p-3 border border-gray-300 rounded bg-white/70 backdrop-blur-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-3 border border-gray-300 rounded bg-white/70 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="w-full p-3 bg-[#1c3f95] text-white rounded hover:bg-blue-900"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;