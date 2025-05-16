export default function UserCard() {
  return (
    <div className="flex items-center bg-gray-100 max-w-xs p-2 shadow-xl rounded-2xl ring ring-1 space-x-4">
      <div
        className="w-16 h-16 rounded-full ring-2 ring-blue-600 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Avatar_m_2.jpg')" }}
      />
      <div className="text-left">
        <h2 className="text-sm font-bold text-gray-800">Juan Pérez</h2>
        <p className="text-xs text-gray-500">juan.perez@email.com</p>
      </div>
    </div>
  );
}
