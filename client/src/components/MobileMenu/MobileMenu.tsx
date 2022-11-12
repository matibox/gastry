import { NavLink } from 'react-router-dom';

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
  return (
    <nav className={styles.menu}>
      {links.map(link => (
        <NavLink
          to={link.path}
          key={link.path}
          className={({ isActive }) => (isActive ? styles.active : '')}
        >
          <span className='material-symbols-outlined icons-normal'>
            {link.iconName}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
