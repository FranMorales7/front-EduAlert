import { Trash2 } from 'lucide-react';

export default function DeleteButton({ onClick }) {
  return (
    <button onClick={ onClick } className="btDelete" >
      <Trash2 className="w-4 h-4" />
      Eliminar
    </button>
  );
}
