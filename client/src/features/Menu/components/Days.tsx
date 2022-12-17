import { Day } from '../../../types/Menu';
import { useMenu } from '../contexts/MenuContext';
import { useDaySwiper } from '../hooks/useDaySwiper';
import styles from '../styles/Days.module.css';

interface DaysProps {
  days: Day[];
}

export function Days({ days }: DaysProps) {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { dispatchMenus, menuActions } = menuContext.menus;

  const x = useDaySwiper(days);

  return (
    <div className={styles.wrapper} style={{ translate: `${x} 0` }}>
      {days.map(day => (
        <span
          key={day.id}
          className={`${styles.day} ${day.isActive ? styles.active : ''}`}
          onClick={() => {
            dispatchMenus({
              type: menuActions.setDayActive,
              payload: day.id,
            });
          }}
        >
          {day.name}
        </span>
      ))}
    </div>
  );
}
