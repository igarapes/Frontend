import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../utils/jwt';
import { Users, UserPlus, UserCircle, ShieldCheck } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  
  // Decodifica o token para saber quem está logado e o seu perfil
  const token = sessionStorage.getItem('@App:token');
  const payload = token ? decodeJWT(token) : null;
  
  const userRole = payload?.role || 'Desconhecido';
  const userId = payload?.id || payload?.sub;

  // Função auxiliar para verificar permissões
  const hasPermission = (allowedRoles) => allowedRoles.includes(userRole);

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho do Dashboard */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
            <p className="text-sm text-gray-500 mt-1">
              Bem-vindo! Você está autenticado com o perfil de acesso:{' '}
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {userRole}
              </span>
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">Módulos Disponíveis</h2>
        
        {/* Grid de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: Gestão de Usuários (Apenas Admin e Técnico) */}
          {hasPermission(['ADMIN', 'TECNICO']) && (
            <div 
              onClick={() => navigate('/gestao-usuarios')}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Listar Usuários</h3>
              </div>
              <p className="text-sm text-gray-500">
                Acesse a tabela de usuários do sistema. Como <strong className="text-gray-700">{userRole}</strong>, você pode visualizar e inativar perfis conforme a hierarquia permitida.
              </p>
            </div>
          )}

          {/* CARD 2: Novo Cadastro (Apenas Admin e Técnico) */}
          {hasPermission(['ADMIN', 'TECNICO']) && (
            <div 
              onClick={() => navigate('/cadastros/novo')}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Novo Usuário</h3>
              </div>
              <p className="text-sm text-gray-500">
                Cadastre novas contas no sistema. O limite de perfis que você pode criar é gerenciado automaticamente pela sua permissão.
              </p>
            </div>
          )}

          {/* CARD 3: Meu Perfil (Todos os Usuários) */}
          <div 
            onClick={() => navigate('/meu-perfil')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Meu Perfil</h3>
            </div>
            <p className="text-sm text-gray-500">
              Área pessoal. Aqui você pode gerenciar suas próprias informações, atualizar seus dados de contato e solicitar a exclusão de sua conta (LGPD).
            </p>
          </div>

          {/* CARD 4: Editar Meus Dados (Atalho rápido para o PUT) */}
          {userId && (
            <div 
              onClick={() => navigate(`/cadastros/editar/${userId}`)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-400 group-hover:border-blue-600 flex items-center justify-center transition-colors">
                  <div className="w-3 h-3 bg-gray-400 group-hover:bg-blue-600 rounded-full transition-colors" />
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Atualizar Cadastro</h3>
              </div>
              <p className="text-sm text-gray-500">
                Atalho direto para atualizar suas informações. Qualquer perfil pode editar os próprios dados no sistema.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}