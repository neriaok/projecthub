import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import LoginPage from './pages/LoginPage';
import RequestsPage from './pages/RequestsPage';
import NewRequestPage from './pages/NewRequestPage';
import { useAppSelector } from './hooks/useAppDispatch';

const HomeRedirect: FC = () => {
  const role = useAppSelector((state) => state.auth.user?.role);
  return <Navigate to={role === 'manager' ? '/approvals' : '/requests'} replace />;
};

const RequestsHome: FC = () => {
  const role = useAppSelector((state) => state.auth.user?.role);
  return <RequestsPage key={role} view={role === 'pmo' ? 'all' : 'mine'} />;
};

const App: FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<RequireAuth />}>
      <Route index element={<HomeRedirect />} />
      <Route path="/requests" element={<RequestsHome />} />
      <Route element={<RequireRole roles={['employee', 'manager']} />}>
        <Route path="/requests/new" element={<NewRequestPage />} />
      </Route>
      <Route element={<RequireRole roles={['manager']} />}>
        <Route path="/approvals" element={<RequestsPage view="approvals" />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
