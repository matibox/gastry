import styles from '../styles/MenuEl.module.css';

import { Menu } from '../../../types/Menu';
import { useMenu } from '../contexts/MenuContext';
import { Icon } from '../../../components/Icon/Icon';
import { FormEvent, useRef } from 'react';
import { useAsyncFn } from '../../../hooks/useAsync';
import { deleteMenu, editMenu } from '../../../services/menu';
import { Error } from '../../../components/Error/Error';
import Loading from '../../../components/Loading/Loading';
import { getWeekday } from '../utils/getWeekday';

interface MenuProps {
  menu: Menu;
  undeletable: boolean;
}

export function MenuEl({ menu, undeletable }: MenuProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const { setIsOpened } = menuContext.menuPicker;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const editMenuFn = useAsyncFn(editMenu);
  const deleteMenuFn = useAsyncFn(deleteMenu);

  function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newName = inputRef.current?.value || menu.name;
    editMenuFn.run(menu.id, newName).then(res => {
      dispatchMenus({
        type: menuActions.editNameAndClose,
        payload: res,
      });
    });
  }

  function handleDelete() {
    deleteMenuFn.run(menu.id).then(res => {
      dispatchMenus({
        type: menuActions.delete,
        payload: res,
      });
    });
  }

  return (
    <>
      <li className={`${styles.item} ${menu.isActive && styles.active}`}>
        {editMenuFn.loading || deleteMenuFn.loading ? (
          <Loading height='0' />
        ) : (
          <>
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
                  const today = menu.days.find(
                    day => day.name === getWeekday().toLowerCase()
                  );
                  if (today) {
                    dispatchMenus({
                      type: menuActions.setDayActive,
                      payload: today.id,
                    });
                  }
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
            {!undeletable && (
              <button className={styles.delete} onClick={handleDelete}>
                <Icon name='delete' />
              </button>
            )}
          </>
        )}
      </li>
      {editMenuFn.errors && <Error errors={editMenuFn.errors} size='small' />}
      {deleteMenuFn.errors && (
        <Error errors={deleteMenuFn.errors} size='small' />
      )}
    </>
  );
}
