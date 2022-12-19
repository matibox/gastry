import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useIsMobile } from '../../contexts/isMobileContext';
import { Icon } from '../Icon/Icon';
import { AnimatePresence, motion } from 'framer-motion';

// styles
import styles from './Navbar.module.css';
import { UserMenu } from './UserMenu';

interface Link {
  title: string;
  icon: string;
  path: string;
}

const links: Link[] = [
  {
    title: 'home',
    icon: 'home',
    path: '/',
  },
  {
    title: 'profile',
    icon: 'account_circle',
    path: '/profile',
  },
  {
    title: 'search',
    icon: 'search',
    path: '/search',
  },
  {
    title: 'favourites',
    icon: 'favorite',
    path: '/favourites',
  },
  {
    title: 'your recipes',
    icon: 'collections_bookmark',
    path: '/recipes',
  },
  {
    title: 'menus',
    icon: 'restaurant_menu',
    path: '/menu',
  },
];

export function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { pathname } = useLocation();
  if (pathname === '/signup' || pathname === '/login') return null;

  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;

  const { isMobile } = useIsMobile();

  const navigate = useNavigate();

  return (
    <header className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link to='/'>
          <img src='/logo.png' alt='gastry' />
        </Link>
      </div>
      {!isMobile && (
        <nav className={styles.nav}>
          {links.map(link => (
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `${isActive ? styles.active : ''} ${styles.link}`
              }
            >
              <span>{link.title}</span>
              <Icon name={link.icon} />
            </NavLink>
          ))}
        </nav>
      )}
      {!user ? (
        <Link to='/login' className='button'>
          <span>login</span>
        </Link>
      ) : (
        <button
          className={styles.userWrapper}
          onClick={() => {
            if (isMobile) {
              setUserMenuOpen(prev => !prev);
              return;
            }
            navigate('/profile');
          }}
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
        {user && userMenuOpen && isMobile && (
          <UserMenu username={user.name} setOpen={setUserMenuOpen} />
        )}
      </AnimatePresence>
    </header>
  );
}
