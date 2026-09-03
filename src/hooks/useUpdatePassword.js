import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePasswordService } from '../services/auth';
import { validatePassword } from '../utils/passwordValidator';

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (newPassword, confirmPassword) => {
    setError(null);

    const { isStrong } = validatePassword(newPassword);
    if (!isStrong) {
      setError('A senha não atende aos requisitos mínimos de segurança.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await updatePasswordService(newPassword, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.message || 'Falha ao atualizar senha. Verifique os requisitos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error, success };
};