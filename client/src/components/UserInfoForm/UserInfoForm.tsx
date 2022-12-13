import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import styles from './UserInfoForm.module.css';
import Github from '../../assets/github-green.png';

interface UserInfoFormProps {
  heading: string;
  headingMsg: {
    main: string;
    link: string;
    redirectURL: string;
  };
  button: {
    label: string;
    icon: string;
  };
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: JSX.Element;
}

export function UserInfoForm({
  heading,
  headingMsg,
  button,
  onSubmit,
  children,
}: UserInfoFormProps) {
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
          {children}
          <button className={styles.button}>
            <span>{button.label}</span>
            <Icon name={button.icon} />
          </button>
        </form>
      </main>
      <footer className={styles.footer}>
        <a href='https://github.com/matibox/gastry' target='_blank'>
          <img src={Github} alt='github' />
        </a>
      </footer>
    </div>
  );
}
