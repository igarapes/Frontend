export function StatusBadge({ isActive }) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  );
}