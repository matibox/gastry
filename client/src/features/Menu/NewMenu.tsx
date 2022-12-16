import { motion } from 'framer-motion';
import { FormEvent } from 'react';
import { useMenu } from './MenuContext';

import styles from './NewMenu.module.css';

export function NewMenu() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const { setIsOpened } = menuContext.newMenuForm;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //TODO db add menu
    // dispatchMenus()
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
            <input type='text' />
          </label>
          <button className={styles.submit}>Add</button>
          {/* 
            //TODO loading
            <button className={styles.loadingButton}>Loading...</button>
          */}
        </form>
      </motion.div>
    </>
  );
}
