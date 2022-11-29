import { FormEvent, Reducer, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../Input/Input';
import styles from './UserInfoForm.module.css';
import { Field, ValueState } from '../../types/UserInfoForm';

interface InputReducerAction {
  payload: string;
  type: InputReducerActions;
}

const inputReducerInitialState: ValueState = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

enum InputReducerActions {
  changeEmail = 'CHANGE_EMAIL',
  changeUsername = 'CHANGE_USERNAME',
  changePassword = 'CHANGE_PASSWORD',
  changeConfirmPassword = 'CHANGE_CONFIRM_PASSWORD',
}

const inputReducer: Reducer<ValueState, InputReducerAction> = (
  state,
  action
) => {
  const { type, payload } = action;

  //TODO switch statement

  return state;
};

interface UserInfoFormProps {
  heading: string;
  headingMsg: {
    main: string;
    link: string;
    redirectURL: string;
  };
  fields: Field[];
  button: {
    label: string;
    icon: string;
  };
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function UserInfoForm({
  heading,
  headingMsg,
  fields,
  button,
  onSubmit,
}: UserInfoFormProps) {
  const [state, dispatch] = useReducer(inputReducer, inputReducerInitialState);

  return (
    <div className={styles.wrapper}>
      <header>
        <Link to='/'>
          <img src='/logo.png' alt='gastry' />
        </Link>
      </header>
      <main className={styles.main}>
        <h1>{heading}</h1>
        <h2>
          {headingMsg.main}{' '}
          <Link to={headingMsg.redirectURL} className={styles.link}>
            {headingMsg.link}
          </Link>
        </h2>
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => onSubmit(e)}
          className={styles.form}
        >
          {fields.map(field => (
            <Input
              key={field.label}
              label={field.label}
              littleLabel={field.littleLabel}
            />
          ))}
        </form>
      </main>
      <footer>{/* //TODO github link */}</footer>
    </div>
  );
}
