import type { FC } from 'react';
import { Avatar, Button, Caption1, Text, Tooltip } from '@fluentui/react-components';
import { Grid20Filled, SignOut20Regular } from '@fluentui/react-icons';
import type { User } from '../../types/models';
import { ROLE_LABELS } from '../../utils/labels';
import styles from './TopBar.module.css';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const TopBar: FC<TopBarProps> = ({ user, onLogout }) => (
  <header className={styles.bar}>
    <div className={styles.brand}>
      <Grid20Filled className={styles.brandIcon} />
      <Text weight="semibold" size={400}>
        ProjectHub
      </Text>
    </div>
    <div className={styles.user}>
      <div className={styles.userText}>
        <Text weight="semibold">{user.name}</Text>
        <Caption1 className={styles.role}>
          {ROLE_LABELS[user.role]} · {user.department}
        </Caption1>
      </div>
      <Avatar name={user.name} color="colorful" size={32} />
      <Tooltip content="התנתקות" relationship="label">
        <Button
          appearance="subtle"
          icon={<SignOut20Regular className={styles.flipIcon} />}
          className={styles.logout}
          onClick={onLogout}
        />
      </Tooltip>
    </div>
  </header>
);

export default TopBar;
