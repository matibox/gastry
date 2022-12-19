import { NavLink } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import { motion } from 'framer-motion';

import styles from './UserMenu.module.css';
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { logout } from '../../services/user';
import { Error } from '../Error/Error';

interface UserMenuProps {
  username: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Link {
  title: string;
  icon: string;
  route: string;
}

const links: Link[] = [
  {
    title: 'home',
    icon: 'home',
    route: '/',
  },
  {
    title: 'profile',
    icon: 'account_circle',
    route: '/profile',
  },
  {
    title: 'your recipes',
    icon: 'collections_bookmark',
    route: '/recipes',
  },
  {
    title: 'favourites',
    icon: 'favorite',
    route: '/favourites',
  },
  {
    title: 'menu',
    icon: 'restaurant_menu',
    route: '/menu',
  },
];

export function UserMenu({ username, setOpen }: UserMenuProps) {
  const logoutFn = useAsyncFn(logout);

  const authContext = useAuth();
  if (!authContext) return;
  const { resetUser } = authContext;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
    >
      <p>welcome, {username}</p>
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <NavLink
              to={link.route}
              className={({ isActive }) =>
                `${isActive && styles.active} ${styles.link}`
              }
              onClick={() => setOpen(false)}
            >
              <span>{link.title}</span>
              <Icon name={link.icon} />
            </NavLink>
          </li>
        ))}
        <li>
          <button
            className={styles.logout}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              logoutFn.run().then(res => {
                resetUser();
                window.location.reload();
              });
            }}
          >
            <span>logout</span>
            <Icon name='logout' />
          </button>
        </li>
        {logoutFn.errors && <Error errors={logoutFn.errors} />}
      </ul>
    </motion.div>
  );
}
