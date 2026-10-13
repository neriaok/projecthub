import type { FC, ReactNode } from 'react';
import styles from './StatTile.module.css';

interface StatTileProps {
  label: string;
  value: number;
  caption: string;
  icon: ReactNode;
  tone?: 'brand' | 'positive' | 'alert';
}

const StatTile: FC<StatTileProps> = ({ label, value, caption, icon, tone = 'brand' }) => (
  <section className={`${styles.tile} ${styles[tone]}`}>
    <div className={styles.top}>
      <span className={styles.label}>{label}</span>
      <span className={styles.icon}>{icon}</span>
    </div>
    <span className={styles.value}>{value.toLocaleString('he-IL')}</span>
    <span className={styles.caption}>{caption}</span>
  </section>
);

export default StatTile;
