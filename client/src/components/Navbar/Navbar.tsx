import { Link, useLocation } from 'react-router-dom';

// styles
import styles from './Navbar.module.css';

export function Navbar() {
  const { pathname } = useLocation();
  if (pathname === '/signup' || pathname === 'login') return null;

  return (
    <header className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link to='/'>
          <img src='/logo.png' alt='gastry' />
        </Link>
      </div>
      <Link to='/signup' className='button'>
        <span>signup</span>
      </Link>
    </header>
  );
}
