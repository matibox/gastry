import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

// styles
import styles from './Navbar.module.css';

export function Navbar() {
  const { pathname } = useLocation();
  if (pathname === '/signup' || pathname === '/login') return null;

  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;

  return (
    <header className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link to='/'>
          <img src='/logo.png' alt='gastry' />
        </Link>
      </div>
      {!user && (
        <Link to='/login' className='button'>
          <span>login</span>
        </Link>
      )}
    </header>
  );
}
