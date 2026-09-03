import { useState } from 'react';
import { useUpdatePassword } from '../../hooks/useUpdatePassword';
import { validatePassword } from '../../utils/passwordValidator';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { PasswordStrength } from '../../components/passwordStrength';

export function FirstAccess() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { handleUpdate, loading, error, success } = useUpdatePassword();

  const { isStrong } = validatePassword(password);
  const isFormValid = isStrong && password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdate(password, confirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Primeiro Acesso</h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Defina sua nova senha para prosseguir para o sistema.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm text-center border border-green-100">
            Senha atualizada com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Nova Senha"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <Input
            label="Confirmar Nova Senha"
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" loading={loading} disabled={!isFormValid || success}>
            Salvar Nova Senha
          </Button>
        </form>
      </div>
    </div>
  );
}