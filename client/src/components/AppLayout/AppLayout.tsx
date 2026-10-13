import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@fluentui/react-components';
import TopBar from '../TopBar';
import SideNav from '../SideNav';
import type { User } from '../../types/models';
import { useLogout } from '../../hooks/useLogout';
import { APP_TOASTER_ID } from '../../utils/toaster';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  user: User;
}

const AppLayout: FC<AppLayoutProps> = ({ user }) => {
  const logout = useLogout();

  return (
    <div className={styles.shell}>
      <TopBar user={user} onLogout={logout} />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <SideNav role={user.role} />
        </aside>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <Toaster toasterId={APP_TOASTER_ID} position="top-end" offset={{ vertical: 64 }} />
    </div>
  );
};

export default AppLayout;
