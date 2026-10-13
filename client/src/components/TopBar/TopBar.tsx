import type { FC } from 'react';
import { Avatar, Button, Caption1, Text, Tooltip } from '@fluentui/react-components';
import { SignOut20Regular } from '@fluentui/react-icons';
import type { User } from '../../types/models';
import { ROLE_LABELS } from '../../utils/labels';
import styles from './TopBar.module.css';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const todayFormatter = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });

const TopBar: FC<TopBarProps> = ({ user, onLogout }) => {
  const firstName = user.name.split(' ')[0];

  return (
    <header className={styles.bar}>
      <div className={styles.greeting}>
        <Text weight="bold" size={400}>
          שלום, {firstName}
        </Text>
        <Caption1 className={styles.date}>{todayFormatter.format(new Date())}</Caption1>
      </div>
      <div className={styles.user}>
        <div className={styles.userChip}>
          <Avatar name={user.name} color="colorful" size={36} />
          <div className={styles.userText}>
            <Text weight="semibold">{user.name}</Text>
            <Caption1 className={styles.role}>
              {ROLE_LABELS[user.role]} · {user.department}
            </Caption1>
          </div>
        </div>
        <Tooltip content="התנתקות" relationship="label">
          <Button
            appearance="subtle"
            shape="circular"
            icon={<SignOut20Regular className={styles.flipIcon} />}
            onClick={onLogout}
          />
        </Tooltip>
      </div>
    </header>
  );
};

export default TopBar;
