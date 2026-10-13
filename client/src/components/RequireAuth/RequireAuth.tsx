import type { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button, MessageBar, MessageBarBody, Spinner } from '@fluentui/react-components';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useGetMeQuery } from '../../features/auth/authApi';
import AppLayout from '../AppLayout';
import styles from './RequireAuth.module.css';

/** Gate for signed-in pages: restores the session from the stored token, then renders the app shell. */
const RequireAuth: FC = () => {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);
  const { isError, refetch } = useGetMeQuery(undefined, { skip: !token || Boolean(user) });

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (!user) {
    return (
      <div className={styles.center}>
        {isError ? (
          <MessageBar intent="error">
            <MessageBarBody>
              לא ניתן לטעון את פרטי המשתמש.{' '}
              <Button appearance="transparent" size="small" onClick={() => refetch()}>
                נסו שוב
              </Button>
            </MessageBarBody>
          </MessageBar>
        ) : (
          <Spinner label="טוען..." />
        )}
      </div>
    );
  }

  return <AppLayout user={user} />;
};

export default RequireAuth;
