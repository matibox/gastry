import { ChangeEvent, FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Error } from '../../components/Error/Error';
import { UserInfoForm } from '../../components/UserInfoForm/UserInfoForm';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { login } from '../../services/user';

import styles from './LoginForm.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useAuth();
  if (!authContext?.setLocalUser) return null;
  const { setLocalUser } = authContext;

  const navigate = useNavigate();
  const location = useLocation();

  const loginFn = useAsyncFn(login);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginFn.run(email, password).then(res => {
      setLocalUser(res);
      navigate('/');
    });
  }

  return (
    <UserInfoForm
      button={{ icon: 'login', label: 'Log in' }}
      heading='Log in'
      headingMsg={{
        main: "Don't have an account?",
        link: 'Sign up',
        redirectURL: '/signup',
      }}
      onSubmit={handleSubmit}
    >
      <>
        <label className={styles.inputWrapper}>
          <span className={styles.label}>Email</span>
          <input
            type='text'
            className={styles.input}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </label>
        <label className={styles.inputWrapper}>
          <span className={styles.label}>Password</span>
          <input
            type='password'
            className={styles.input}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
        </label>
        {loginFn.errors && <Error errors={loginFn.errors} size='small' />}
        {location.state?.signup && (
          <p className={styles.signupMessage}>
            Successfully signed in, log in to your account
          </p>
        )}
      </>
    </UserInfoForm>
  );
}
