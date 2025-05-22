'use client';

export default function SolvedToggleButton({ value, onChange }) {
  return (
    <span
      type="button"
      onClick={() => onChange(!value)}
      className={`cursor-pointer px-4 py-2 rounded text-white font-semibold transition-colors duration-200 ${
        value ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
      }`}
    >
      {value ? 'Resuelta' : 'Sin Resolver'}
    </span>
  );
}
