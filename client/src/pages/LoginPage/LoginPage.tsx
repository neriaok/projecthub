import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Body1,
  Button,
  Caption1,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
} from '@fluentui/react-components';
import {
  ArrowLeft20Regular,
  CheckmarkCircle20Filled,
  DataTrending20Filled,
  LockClosed20Regular,
  Mail20Regular,
  PeopleTeam20Filled,
} from '@fluentui/react-icons';
import BrandMark from '../../components/BrandMark';
import NetworkPattern from '../../components/NetworkPattern';
import { useLoginMutation } from '../../features/auth/authApi';
import type { LoginBody } from '../../features/auth/authApi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { baseApi } from '../../store/baseApi';
import { getApiErrorMessage } from '../../utils/apiError';
import config from '../../config';
import styles from './LoginPage.module.css';

interface LocationState {
  from?: string;
}

const HIGHLIGHTS = [
  { icon: PeopleTeam20Filled, text: 'כל בקשה מנותבת אוטומטית למנהל הישיר לאישור' },
  { icon: CheckmarkCircle20Filled, text: 'החלטות, הערות ושינויי סטטוס במקום אחד' },
  { icon: DataTrending20Filled, text: 'תמונת מצב ל-PMO: תקציבים, סטטוסים ופרויקטים באיחור' },
];

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = (location.state as LocationState | null)?.from ?? '/';

  if (token) return <Navigate to={redirectTo} replace />;

  const signIn = async (credentials: LoginBody) => {
    // Start every session with an empty cache, so no data from a previous user is shown.
    dispatch(baseApi.util.resetApiState());
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
      <section className={styles.showcase} aria-hidden="true">
        <NetworkPattern className={styles.pattern} seed={3} nodes={70} width={900} height={900} linkDistance={140} />
        <div className={styles.glow} />
        <div className={styles.showcaseContent}>
          <BrandMark size="large" tone="light" />
          <h2 className={styles.headline}>
            מהרעיון ועד הביצוע,
            <br />
            <span className={styles.headlineAccent}>כל בקשת פרויקט במסלול אחד.</span>
          </h2>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className={styles.highlightIcon}>
                  <Icon />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.mobileBrand}>
            <BrandMark tone="dark" />
          </div>
          <div className={styles.heading}>
            <h1 className={styles.title}>כניסה לחשבון</h1>
            <Body1 className={styles.subtitle}>התחברו עם חשבון הארגון כדי להמשיך</Body1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field label="אימייל" required>
              <Input
                size="large"
                type="email"
                autoComplete="username"
                placeholder="name@company.co.il"
                contentBefore={<Mail20Regular />}
                value={email}
                onChange={(_, data) => setEmail(data.value)}
              />
            </Field>
            <Field label="סיסמה" required>
              <Input
                size="large"
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
              className={styles.submit}
              disabled={isLoading || !email || !password}
              icon={isLoading ? <Spinner size="tiny" appearance="inverted" /> : <ArrowLeft20Regular />}
              iconPosition="after"
            >
              כניסה
            </Button>
          </form>

          {config.quickLogin.enabled && (
            <div className={styles.quick}>
              <div className={styles.quickDivider}>
                <Caption1>כניסה מהירה</Caption1>
              </div>
              <div className={styles.quickList}>
                {config.quickLogin.accounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    className={styles.quickItem}
                    disabled={isLoading}
                    onClick={() => void signIn({ email: account.email, password: config.quickLogin.password })}
                  >
                    <Avatar name={account.name} color="colorful" size={36} />
                    <span className={styles.quickText}>
                      <Text weight="semibold">{account.name}</Text>
                      <Caption1 className={styles.quickRole}>{account.roleLabel}</Caption1>
                    </span>
                    <ArrowLeft20Regular className={styles.quickArrow} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
