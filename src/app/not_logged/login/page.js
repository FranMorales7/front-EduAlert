'use client'
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../../../public/images/CF_logo.png';
import fondo from '../../../../public/images/patron.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      const session = await getSession();

      if (session?.user?.is_admin) {
        router.push('/logged/manager/inicio');
      } else {
        router.push('/logged/teacher/inicio');
      }
    } else {
      console.error('Error de autenticación', result.error);
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div 
    className="z-20 relative w-full h-screen flex items-center justify-center overflow-hidden bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90%"
    //style={{ backgroundImage: `url(${fondo.src})` }}
    >
      <div className="ring-4 ring-blue-500 relative z-10 flex w-4/5 h-4/5 backdrop-blur-md bg-white/60 rounded-xl shadow-xl overflow-hidden">
        <div className="ring-2 ring-blue-500/50 w-1/2 flex items-center justify-center bg-white/70">
          <Image src={logo} alt="Logo" width={800} height={750} />
        </div>

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
              className="cursor-pointer w-full p-3 bg-[#1c3f95] text-white rounded hover:bg-blue-900"
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
