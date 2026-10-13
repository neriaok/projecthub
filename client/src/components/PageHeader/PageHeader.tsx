import type { FC, ReactNode } from 'react';
import { Body1 } from '@fluentui/react-components';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ title, eyebrow, subtitle, actions }) => (
  <header className={styles.header}>
    <div className={styles.text}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <Body1 className={styles.subtitle}>{subtitle}</Body1>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default PageHeader;
