import { Menu } from '../../../types/Menu';
import styles from '../styles/MenuTable.module.css';
import { Days } from './Days';

interface MenuTableProps {
  currentMenu: Menu;
}

export function MenuTable({ currentMenu }: MenuTableProps) {
  const { days } = currentMenu;

  return (
    <div className={styles.wrapper}>
      <Days days={days} />
    </div>
  );
}
