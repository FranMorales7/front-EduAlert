'use client';
import { useEffect, useState } from 'react';

export default function Header() {
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('nombre');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="text-lg font-semibold flex">
      {name ? `Bienevenid@ ${name} ` : 'Hola'}
    </div>
  );
}
