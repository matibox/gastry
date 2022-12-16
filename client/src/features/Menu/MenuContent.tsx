import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Icon } from '../../components/Icon/Icon';
import styles from './MenuContent.module.css';
import { MenuContextProvider } from './MenuContext';
import { MenuPicker } from './MenuPicker';

export function MenuContent() {
  const [isMenuPickerOpened, setIsMenuPickerOpened] = useState(false);

  return (
    <MenuContextProvider>
      <>
        <AnimatePresence>
          {isMenuPickerOpened && (
            <MenuPicker setOpened={setIsMenuPickerOpened} />
          )}
        </AnimatePresence>
        <section className={styles.titleWrapper}>
          <h2>custom menu 1</h2>
          <button onClick={() => setIsMenuPickerOpened(prev => !prev)}>
            <Icon name='menu' />
          </button>
        </section>
        <section>{/* menu content */}</section>
      </>
    </MenuContextProvider>
  );
}
