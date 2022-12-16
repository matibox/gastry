import styles from './MenuEl.module.css';

import { Menu } from '../../types/Menu';
import { useMenu } from './MenuContext';
import { Icon } from '../../components/Icon/Icon';

interface MenuProps {
  menu: Menu;
}

export function MenuEl({ menu }: MenuProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { setMenus } = menuContext.menus;

  return (
    <li
      key={menu.name}
      className={`${styles.item} ${menu.isActive && styles.active}`}
    >
      {menu.isActive && <span className={styles.activeDot} />}
      <span
        onClick={() =>
          setMenus(prev => {
            return prev.map(prevMenu => {
              if (prevMenu.name === menu.name)
                return { ...prevMenu, isActive: true };
              return { ...prevMenu, isActive: false };
            });
          })
        }
      >
        {menu.name}
      </span>
      <button
        className={styles.edit}
        onClick={() => {
          setMenus(prev => {
            return prev.map(prevMenu => {
              if (prevMenu.name === menu.name)
                return { ...prevMenu, isEditing: !prevMenu.isEditing };
              return { ...prevMenu, isEditing: false };
            });
          });
        }}
      >
        <Icon name={`${menu.isEditing ? 'cancel' : 'edit'}`} />
      </button>
      <button className={styles.delete}>
        <Icon name='delete' />
      </button>
    </li>
  );
}
