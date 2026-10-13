import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '../../types/models';
import { NAV_ITEMS } from './navItems';
import styles from './SideNav.module.css';

interface SideNavProps {
  role: UserRole;
}

const SideNav: FC<SideNavProps> = ({ role }) => (
  <nav className={styles.nav} aria-label="ניווט ראשי">
    {NAV_ITEMS[role].map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        <Icon className={styles.icon} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default SideNav;
