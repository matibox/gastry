import { AnimatePresence } from 'framer-motion';
import { Icon } from '../../components/Icon/Icon';
import styles from './MenuContent.module.css';
import { useMenu } from './MenuContext';
import { MenuPicker } from './MenuPicker';
import { NewMenu } from './NewMenu';

export function MenuContent() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { menuPicker, newMenuForm } = menuContext;

  return (
    <>
      <AnimatePresence>{menuPicker.isOpened && <MenuPicker />}</AnimatePresence>
      <AnimatePresence>{newMenuForm.isOpened && <NewMenu />}</AnimatePresence>
      <section className={styles.titleWrapper}>
        <h2>custom menu 1</h2>
        <button onClick={() => menuPicker.setIsOpened(prev => !prev)}>
          <Icon name='menu' />
        </button>
      </section>
      <section>{/* menu content */}</section>
      <button
        className={styles.addBtn}
        onClick={() => newMenuForm.setIsOpened(prev => !prev)}
      >
        <Icon name={`${newMenuForm.isOpened ? 'close' : 'add'}`} />
      </button>
    </>
  );
}
