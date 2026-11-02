import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { decodeJWT } from '../../utils/jwt';
import { ConfirmModal } from '../../components/ConfirmModal';

export function UserProfile() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('@App:token');
  const payload = token ? decodeJWT(token) : null;
  
  // Pegamos o ID e a Role do JWT para as regras (geralmente fica em payload.id ou payload.sub dependendo da sua api)
  const loggedUserId = payload?.id || payload?.sub; 
  const loggedUserRole = payload?.role;

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete(`/user/${loggedUserId}`);
      alert('Sua conta foi excluída com sucesso. Seus dados foram anonimizados.');
      
      // Limpa a sessão e desloga
      sessionStorage.removeItem('@App:token');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao tentar excluir a conta.');
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Meu Perfil</h2>
        <p className="text-sm text-gray-500 mb-8">Gerencie as informações da sua conta.</p>

        {/* Outras informações do perfil poderiam entrar aqui... */}

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Zona de Perigo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ao excluir sua conta, seus dados pessoais serão anonimizados permanentemente (LGPD). Esta ação não pode ser desfeita.
          </p>

          {loggedUserRole === 'ADMIN' ? (
            <p className="text-sm text-red-500 font-medium">
              Acesso negado: Administradores não podem excluir a própria conta. Contate o suporte.
            </p>
          ) : (
            <button 
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
            >
              Excluir minha conta
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Atenção: Exclusão de Conta"
        description="Tem certeza que deseja apagar sua conta? Todos os seus dados pessoais serão anonimizados para fins de auditoria e você perderá o acesso ao sistema. Essa ação é irreversível."
        confirmText={loading ? "Excluindo..." : "Sim, apagar minha conta"}
        cancelText="Cancelar"
        onConfirm={handleDeleteAccount}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}