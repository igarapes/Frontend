import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PrivateRoute } from './components/privateRoutes';
import { Login } from './pages/Login';
import { FirstAccess } from './pages/FirstAccess';

import { UserList } from './pages/UserList';
import { UserForm } from './pages/UserForm';
import { UserProfile } from './pages/UserProfile';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Privadas Básicas (Todos os perfis logados têm acesso) */}
        <Route element={<PrivateRoute />}>
          <Route path="/primeiro-acesso" element={<FirstAccess />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          
          {/* Perfil do Usuário: onde ele pode excluir a própria conta (DELETE) */}
          <Route path="/meu-perfil" element={<UserProfile />} />
        </Route>

        {/* Rotas de Gestão (Acesso restrito para ADMIN e TECNICO) */}
        <Route element={<PrivateRoute allowedRoles={['ADMIN', 'TECNICO']} />}>
          {/* GET /user */}
          <Route path="/gestao-usuarios" element={<UserList />} />
          
          {/* POST /user */}
          <Route path="/cadastros/novo" element={<UserForm />} />
        </Route>

        {/* Rota de Edição (PUT /user/:id) 
            Permite ADMIN, TECNICO e USUARIO (pois o backend permite que o usuário edite a si mesmo) */}
        <Route element={<PrivateRoute allowedRoles={['ADMIN', 'TECNICO', 'USUARIO']} />}>
          <Route path="/cadastros/editar/:id" element={<UserForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;