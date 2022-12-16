import styles from './MenuEl.module.css';

import { Menu } from '../../types/Menu';
import { useMenu } from './MenuContext';
import { Icon } from '../../components/Icon/Icon';
import { ChangeEvent, FormEvent, useRef } from 'react';

interface MenuProps {
  menu: Menu;
}

export function MenuEl({ menu }: MenuProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const { setIsOpened } = menuContext.menuPicker;

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatchMenus({
      type: menuActions.editNameAndClose,
      payload: { ...menu, name: inputRef.current?.value || menu.name },
    });
  }

  return (
    <li className={`${styles.item} ${menu.isActive && styles.active}`}>
      {menu.isActive && <span className={styles.activeDot} />}
      {menu.isEditing ? (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleEdit(e)}>
          <input
            type='text'
            defaultValue={menu.name}
            ref={inputRef}
            className={styles.input}
            autoFocus
          />
        </form>
      ) : (
        <span
          onClick={() => {
            dispatchMenus({ type: menuActions.setActive, payload: menu });
            setTimeout(() => {
              setIsOpened(false);
            }, 250);
          }}
          className={styles.name}
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
