import Image from 'next/image';

export default function UserCard() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6 text-center space-y-4">
      <div className="flex justify-center">
        <Image
          src="/images/avatar-default.png" // Coloca aquí la ruta de tu imagen
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Juan Pérez</h2>
        <p className="text-gray-500">juan.perez@example.com</p>
      </div>
    </div>
  );
}
