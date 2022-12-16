import { motion } from 'framer-motion';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Error } from '../../components/Error/Error';
import { useAsyncFn } from '../../hooks/useAsync';
import { addMenu } from '../../services/menu';
import { useMenu } from './MenuContext';

import styles from './NewMenu.module.css';

export function NewMenu() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const { setIsOpened } = menuContext.newMenuForm;

  const [name, setName] = useState('');

  const addMenuFn = useAsyncFn(addMenu);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addMenuFn.run(name).then(res => {
      const newMenu = { ...res, isActive: false, isEditing: false };

      dispatchMenus({
        type: menuActions.addLocalMenu,
        payload: newMenu,
      });

      dispatchMenus({
        type: menuActions.setActive,
        payload: newMenu,
      });

      setIsOpened(false);
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        className={styles.overlay}
        onClick={() => setIsOpened(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: 'backOut',
        }}
        className={styles.wrapper}
      >
        <h3>New menu</h3>
        <form
          className={styles.form}
          onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          <label>
            <span>Name</span>
            <input
              type='text'
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              autoFocus
            />
          </label>
          {addMenuFn.errors && (
            <Error errors={addMenuFn.errors} size='normal' />
          )}
          {!addMenuFn.loading && <button className={styles.submit}>Add</button>}
          {addMenuFn.loading && (
            <button className={`${styles.submit} ${styles.loadingButton}`}>
              Loading...
            </button>
          )}
        </form>
      </motion.div>
    </>
  );
}
