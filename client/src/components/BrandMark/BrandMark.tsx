import type { FC } from 'react';
import styles from './BrandMark.module.css';

interface BrandMarkProps {
  size?: 'medium' | 'large';
  tone?: 'light' | 'dark';
  showTagline?: boolean;
}

const BrandMark: FC<BrandMarkProps> = ({ size = 'medium', tone = 'light', showTagline = false }) => (
  <div className={`${styles.brand} ${styles[size]} ${styles[tone]}`}>
    <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="brandMarkGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f7de1" />
          <stop offset="1" stopColor="#123a73" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#brandMarkGradient)" />
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
        <line x1="16" y1="16" x2="9" y2="9" />
        <line x1="16" y1="16" x2="24" y2="11" />
        <line x1="16" y1="16" x2="12" y2="24" />
      </g>
      <circle cx="16" cy="16" r="4" fill="#ffb547" />
      <circle cx="9" cy="9" r="2.6" fill="#fff" />
      <circle cx="24" cy="11" r="2.6" fill="#fff" />
      <circle cx="12" cy="24" r="2.6" fill="#fff" />
    </svg>
    <div className={styles.text}>
      <span className={styles.name} dir="ltr">
        Project<span className={styles.nameAccent}>Hub</span>
      </span>
      {showTagline && <span className={styles.tagline}>ניהול בקשות פרויקט</span>}
    </div>
  </div>
);

export default BrandMark;
