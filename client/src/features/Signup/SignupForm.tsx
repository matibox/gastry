import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Error } from '../../components/Error/Error';
import { UserInfoForm } from '../../components/UserInfoForm/UserInfoForm';
import { useAsyncFn } from '../../hooks/useAsync';
import { signup } from '../../services/user';

import styles from './SignupForm.module.css';

const inputFields = [
  {
    label: 'Email',
  },
  { label: 'Username' },
  {
    label: 'Password',
    littleLabel: 'Password must be at least 6 characters long.',
  },
  { label: 'Confirm password' },
];

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const signupFn = useAsyncFn(signup);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signupFn.run(email, username, password, confirmPassword).then(res => {
      navigate('/');
      return res;
    });
  }

  return (
    <UserInfoForm
      button={{ label: 'Sign up', icon: 'login' }}
      heading='Sign up'
      headingMsg={{
        main: 'Already have an account?',
        link: 'Log in.',
        redirectURL: '/login',
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
          <span className={styles.label}>Username</span>
          <input
            type='text'
            className={styles.input}
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
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
          <span className={styles.littleLabel}>
            Password must be at least 6 characters long.
          </span>
        </label>
        <label className={styles.inputWrapper}>
          <span className={styles.label}>Confirm password</span>
          <input
            type='password'
            className={styles.input}
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            required
          />
        </label>
        {signupFn.errors && <Error errors={signupFn.errors} size='small' />}
      </>
    </UserInfoForm>
  );
}
