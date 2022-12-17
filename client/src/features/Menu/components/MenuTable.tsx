import { Icon } from '../../../components/Icon/Icon';
import { useMenu } from '../contexts/MenuContext';
import styles from '../styles/MenuTable.module.css';

export function MenuTable() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { getActive } = menuContext.days;
  const { setIsOpened } = menuContext.recipePick;
  const { setCurrentId } = menuContext.timeOfDays;
  const currentDay = getActive();

  return (
    <>
      {currentDay?.timeOfDays.map(timeOfDay => (
        <div key={timeOfDay.id} className={styles.row}>
          <span className={styles.name}>
            {timeOfDay.name.replace('_', ' ')}
          </span>
          {timeOfDay.recipe ? (
            <div className={styles.recipeWrapper}>
              <p className={styles.recipe}>{timeOfDay.recipe.title}</p>
              {/*//TODO delete*/}
              <button onClick={() => {}}>
                <Icon name='delete' />
              </button>
            </div>
          ) : (
            <button
              className={styles.addBtn}
              onClick={() => {
                setIsOpened(true);
                setCurrentId(timeOfDay.id);
              }}
            >
              <Icon name='add' />
            </button>
          )}
        </div>
      ))}
    </>
  );
}
