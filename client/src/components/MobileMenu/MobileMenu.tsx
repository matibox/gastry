import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../Icon/Icon';

// styles
import styles from './MobileMenu.module.css';

interface Link {
  path: string;
  iconName: string;
}

const links: Link[] = [
  { path: '/', iconName: 'home' },
  { path: '/search', iconName: 'search' },
  { path: '/favourites', iconName: 'favorite' },
  { path: '/recipes', iconName: 'collections_bookmark' },
  { path: '/menu', iconName: 'restaurant_menu' },
];

export function MobileMenu() {
  const { pathname } = useLocation();
  if (pathname === '/signup' || pathname === '/login') return null;

  return (
    <nav className={styles.menu}>
      {links.map(link => (
        <NavLink
          to={link.path}
          key={link.path}
          className={({ isActive }) => (isActive ? styles.active : '')}
          end={true}
        >
          <Icon name={link.iconName} />
        </NavLink>
      ))}
    </nav>
  );
}
