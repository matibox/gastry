import { Link } from 'react-router-dom';

// styles
import styles from './Navbar.module.css';

export function Navbar() {
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
