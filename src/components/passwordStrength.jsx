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
    <div className="mt-3 space-y-3 p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-100">
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

      <ul className="space-y-1.5 mt-3">
        {results.map((req) => (
          <li key={req.id} className="flex items-start text-xs sm:text-sm">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span className={req.met ? 'text-gray-700 leading-tight' : 'text-gray-500 leading-tight'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}