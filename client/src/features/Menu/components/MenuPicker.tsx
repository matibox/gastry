import { motion } from 'framer-motion';
import { MenuEl } from './MenuEl';
import { useMenu } from '../contexts/MenuContext';
import styles from '../styles/MenuPicker.module.css';
import { useIsMobile } from '../../../contexts/isMobileContext';

export function MenuPicker() {
  const menuContext = useMenu();
  const { isMobile } = useIsMobile();
  if (!menuContext) return null;
  const { data: menus } = menuContext.menus;
  const { setIsOpened } = menuContext.menuPicker;

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
        className={`${styles.overlay} ${!isMobile && styles.pc}`}
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
        className={`${styles.wrapper} ${!isMobile && styles.pc}`}
      >
        <h3>Menu picker</h3>
        <ul className={styles.menuList}>
          {menus.map(menu => (
            <MenuEl
              key={menu.id}
              menu={menu}
              undeletable={menus.length === 1}
            />
          ))}
        </ul>
      </motion.div>
    </>
  );
}
