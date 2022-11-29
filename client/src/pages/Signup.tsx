import { FormEvent } from 'react';
import { UserInfoForm } from '../components/UserInfoForm/UserInfoForm';

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

export function Signup() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      fields={inputFields}
      onSubmit={handleSubmit}
    />
  );
}
