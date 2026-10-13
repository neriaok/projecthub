import type { FC, ReactNode } from 'react';
import { Body1, Title2 } from '@fluentui/react-components';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <header className={styles.header}>
    <div className={styles.text}>
      <Title2 as="h1">{title}</Title2>
      {subtitle && <Body1 className={styles.subtitle}>{subtitle}</Body1>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export default PageHeader;
