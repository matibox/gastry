import { motion } from 'framer-motion';
import { useState } from 'react';
import { Icon } from '../../components/Icon/Icon';
import { MenuEl } from './MenuEl';
import { useMenu } from './MenuContext';
import styles from './MenuPicker.module.css';

interface MenuPickerProps {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MenuPicker({ setOpened }: MenuPickerProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { data: menus, setMenus } = menuContext.menus;

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
        onClick={() => setOpened(false)}
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
        <h3>Menu picker</h3>
        <ul className={styles.menuList}>
          {menus.map(menu => (
            <MenuEl key={menu.name} menu={menu} />
          ))}
        </ul>
      </motion.div>
    </>
  );
}
