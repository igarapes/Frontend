import { Navigate, Outlet } from 'react-router-dom';
import { decodeJWT } from '../utils/jwt';

export function PrivateRoute({ allowedRoles }) {
  const token = sessionStorage.getItem('@App:token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const payload = decodeJWT(token);

    if (!payload || !allowedRoles.includes(payload.role)) {
      console.warn(`Acesso bloqueado: o papel '${payload?.role}' não tem permissão para esta rota.`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}