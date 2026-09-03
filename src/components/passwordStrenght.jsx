import { CheckCircle2, XCircle } from 'lucide-react';

export function PasswordStrength({ password = '' }) {
  const requirements = [
    { id: 'length', label: 'Mínimo de 8 caracteres', met: password.length >= 8 },
    { id: 'uppercase', label: 'Pelo menos uma letra maiúscula', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'Pelo menos um número', met: /[0-9]/.test(password) },
    { id: 'special', label: 'Pelo menos um caractere especial', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = requirements.filter(req => req.met).length;
  
  const getProgressColor = () => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md border border-gray-100">
      <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-gray-200">
        {[1, 2, 3, 4].map((level) => (
          <div 
            key={level} 
            className={`h-full flex-1 transition-all duration-300 ${score >= level ? getProgressColor() : 'bg-transparent'}`} 
          />
        ))}
      </div>
      
      <ul className="space-y-1.5 mt-3">
        {requirements.map((req) => (
          <li key={req.id} className="flex items-center text-sm">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            )}
            <span className={req.met ? 'text-gray-700' : 'text-gray-500'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}