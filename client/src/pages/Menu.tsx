import { MenuContent } from '../features/Menu/MenuContent';
import { MenuContextProvider } from '../features/Menu/MenuContext';
import styles from './SearchSec.module.css';

export function Menu() {
  return (
    <main className={styles.wrapper}>
      <h1>menu editor</h1>
      <MenuContextProvider>
        <MenuContent />
      </MenuContextProvider>
    </main>
  );
}
