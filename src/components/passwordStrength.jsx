import { CheckCircle2, XCircle } from 'lucide-react';
import { validatePassword } from '../utils/passwordValidator';

export function PasswordStrength({ password = '' }) {
  const { results, score } = validatePassword(password);

  const getProgressColor = () => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-2 space-y-3 p-3 bg-gray-50 rounded-md border border-gray-100">
      <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-200">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              score >= level ? getProgressColor() : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <ul className="space-y-1 mt-2">
        {results.map((req) => (
          <li key={req.id} className="flex items-center text-xs">
            {req.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-gray-400 mr-1.5 flex-shrink-0" />
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