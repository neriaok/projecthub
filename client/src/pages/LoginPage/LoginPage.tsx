import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Body1,
  Button,
  Caption1,
  Card,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
  Title2,
} from '@fluentui/react-components';
import { Grid24Filled, LockClosed20Regular, Mail20Regular } from '@fluentui/react-icons';
import { useLoginMutation } from '../../features/auth/authApi';
import type { LoginBody } from '../../features/auth/authApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { getApiErrorMessage } from '../../utils/apiError';
import config from '../../config';
import styles from './LoginPage.module.css';

interface LocationState {
  from?: string;
}

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = (location.state as LocationState | null)?.from ?? '/';

  if (token) return <Navigate to={redirectTo} replace />;

  const signIn = async (credentials: LoginBody) => {
    try {
      await login(credentials).unwrap();
      navigate(redirectTo, { replace: true });
    } catch {
      // The error is shown from the mutation state.
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void signIn({ email, password });
  };

  const errorMessage =
    error && 'status' in error && error.status === 401
      ? 'האימייל או הסיסמה שגויים'
      : error
        ? getApiErrorMessage(error)
        : null;

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Grid24Filled />
          </span>
          <Title2 as="h1">ProjectHub</Title2>
          <Body1 className={styles.tagline}>הגשה, אישור ומעקב אחר בקשות פרויקט</Body1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field label="אימייל" required>
            <Input
              type="email"
              autoComplete="username"
              contentBefore={<Mail20Regular />}
              value={email}
              onChange={(_, data) => setEmail(data.value)}
            />
          </Field>
          <Field label="סיסמה" required>
            <Input
              type="password"
              autoComplete="current-password"
              contentBefore={<LockClosed20Regular />}
              value={password}
              onChange={(_, data) => setPassword(data.value)}
            />
          </Field>

          {errorMessage && (
            <MessageBar intent="error">
              <MessageBarBody>{errorMessage}</MessageBarBody>
            </MessageBar>
          )}

          <Button
            type="submit"
            appearance="primary"
            size="large"
            disabled={isLoading || !email || !password}
            icon={isLoading ? <Spinner size="tiny" /> : undefined}
          >
            כניסה
          </Button>
        </form>

        {config.quickLogin.enabled && (
          <div className={styles.quick}>
            <Divider>
              <Caption1>כניסה מהירה</Caption1>
            </Divider>
            <div className={styles.quickButtons}>
              {config.quickLogin.accounts.map((account) => (
                <Button
                  key={account.email}
                  appearance="secondary"
                  className={styles.quickButton}
                  disabled={isLoading}
                  onClick={() => void signIn({ email: account.email, password: config.quickLogin.password })}
                >
                  <span className={styles.quickText}>
                    <Text weight="semibold">{account.name}</Text>
                    <Caption1 className={styles.quickRole}>{account.roleLabel}</Caption1>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
