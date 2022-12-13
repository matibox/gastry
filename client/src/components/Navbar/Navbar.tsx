import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useIsMobile } from '../../contexts/isMobileContext';
import { Icon } from '../Icon/Icon';
import { AnimatePresence, motion } from 'framer-motion';

// styles
import styles from './Navbar.module.css';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { pathname } = useLocation();
  if (pathname === '/signup' || pathname === '/login') return null;

  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;

  const { isMobile } = useIsMobile();

  return (
    <header className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link to='/'>
          <img src='/logo.png' alt='gastry' />
        </Link>
      </div>
      {!user ? (
        <Link to='/login' className='button'>
          <span>login</span>
        </Link>
      ) : (
        <button
          className={styles.userWrapper}
          onClick={() => setUserMenuOpen(prev => !prev)}
        >
          <img src={user.profilePicture} alt={user.name} />
          {isMobile && (
            <motion.div
              animate={{
                rotate: userMenuOpen ? 180 : 0,
              }}
            >
              <Icon name='expand_more' />
            </motion.div>
          )}
        </button>
      )}
      <AnimatePresence>
        {user && userMenuOpen && (
          <UserMenu username={user.name} setOpen={setUserMenuOpen} />
        )}
      </AnimatePresence>
    </header>
  );
}
