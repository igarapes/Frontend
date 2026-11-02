import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../../services/api';
import { decodeJWT } from '../../utils/jwt';
import { Button } from '../../components/button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { UserTable } from '../../components/UserTable';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [userToInactivate, setUserToInactivate] = useState(null);
  
  const navigate = useNavigate();

  const token = sessionStorage.getItem('@App:token');
  const loggedUserRole = token ? decodeJWT(token)?.role : null;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      alert('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/cadastros/editar/${user.id}`, { state: { user } });
  };

  const confirmInactivation = (user) => {
    setUserToInactivate(user);
    setModalOpen(true);
  };

  const executeInactivation = async () => {
    if (!userToInactivate) return;
    try {
      await api.patch(`/user/${userToInactivate.id}/inactivate`);
      setModalOpen(false);
      setUserToInactivate(null);
      fetchUsers(); 
    } catch (error) {
      alert('Erro ao inativar usuário: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
        <div className="w-48">
          <Button onClick={() => navigate('/cadastros/novo')}>
            <Plus className="w-4 h-4 mr-2 inline" /> Novo Usuário
          </Button>
        </div>
      </div>

      {/* Tabela extraída */}
      <UserTable 
        users={users} 
        loading={loading} 
        loggedUserRole={loggedUserRole}
        onEdit={handleEdit}
        onInactivate={confirmInactivation}
      />

      {/* Modal Genérico */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Confirmar Inativação"
        description={`Tem certeza que deseja inativar o usuário ${userToInactivate?.name}?`}
        confirmText="Inativar"
        cancelText="Cancelar"
        onConfirm={executeInactivation}
        onCancel={() => {
          setModalOpen(false);
          setUserToInactivate(null);
        }}
      />
    </div>
  );
}