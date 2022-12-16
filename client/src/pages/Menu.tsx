import { Icon } from '../components/Icon/Icon';
import { MenuContent } from '../features/Menu/MenuContent';
import styles from './SearchSec.module.css';

export function Menu() {
  return (
    <main className={styles.wrapper}>
      <h1>menu editor</h1>
      <MenuContent />
      <button className={styles.addBtn}>
        <Icon name='add' />
      </button>
    </main>
  );
}
