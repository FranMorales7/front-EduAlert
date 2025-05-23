import { Pencil } from 'lucide-react';

export default function EditButton({ onClick }) {
  return (
    <button onClick={onClick} className="btEdit" >
      <Pencil className="w-4 h-4" />
      Editar
    </button>
  );
}
