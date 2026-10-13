import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@fluentui/react-components';
import TopBar from '../TopBar';
import SideNav from '../SideNav';
import BrandMark from '../BrandMark';
import NetworkPattern from '../NetworkPattern';
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
      <aside className={styles.sidebar}>
        <NetworkPattern
          className={styles.sidebarPattern}
          seed={11}
          nodes={26}
          width={260}
          height={700}
          linkDistance={110}
        />
        <div className={styles.sidebarBrand}>
          <BrandMark tone="light" showTagline />
        </div>
        <SideNav role={user.role} />
      </aside>
      <div className={styles.main}>
        <TopBar user={user} onLogout={logout} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <Toaster toasterId={APP_TOASTER_ID} position="top-end" offset={{ vertical: 72 }} />
    </div>
  );
};

export default AppLayout;
