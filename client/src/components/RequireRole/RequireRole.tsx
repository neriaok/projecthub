import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppDispatch';
import type { UserRole } from '../../types/models';

interface RequireRoleProps {
  roles: UserRole[];
}

/** Hides pages the current role cannot use. The server enforces the same rules. */
const RequireRole: FC<RequireRoleProps> = ({ roles }) => {
  const role = useAppSelector((state) => state.auth.user?.role);
  if (!role || !roles.includes(role)) return <Navigate to="/requests" replace />;
  return <Outlet />;
};

export default RequireRole;
