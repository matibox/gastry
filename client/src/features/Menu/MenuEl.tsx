import styles from './MenuEl.module.css';

import { Menu } from '../../types/Menu';
import { useMenu } from './MenuContext';
import { Icon } from '../../components/Icon/Icon';
import { ChangeEvent } from 'react';

interface MenuProps {
  menu: Menu;
}

export function MenuEl({ menu }: MenuProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;

  return (
    <li
      key={menu.name}
      className={`${styles.item} ${menu.isActive && styles.active}`}
    >
      {menu.isActive && <span className={styles.activeDot} />}
      {menu.isEditing ? (
        <input
          type='text'
          value={menu.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => null}
        />
      ) : (
        <span
          onClick={() =>
            dispatchMenus({ type: menuActions.setActive, payload: menu })
          }
        >
          {menu.name}
        </span>
      )}
      <button
        className={styles.edit}
        onClick={() =>
          dispatchMenus({ type: menuActions.setEditing, payload: menu })
        }
      >
        <Icon name={`${menu.isEditing ? 'cancel' : 'edit'}`} />
      </button>
      <button className={styles.delete}>
        <Icon name='delete' />
      </button>
    </li>
  );
}
