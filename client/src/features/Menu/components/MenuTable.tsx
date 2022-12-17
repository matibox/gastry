import { Error } from '../../../components/Error/Error';
import { Icon } from '../../../components/Icon/Icon';
import Loading from '../../../components/Loading/Loading';
import { useAsyncFn } from '../../../hooks/useAsync';
import { deleteRecipe } from '../../../services/menu';
import { useMenu } from '../contexts/MenuContext';
import styles from '../styles/MenuTable.module.css';

export function MenuTable() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { getActive } = menuContext.days;
  const { setIsOpened } = menuContext.recipePick;
  const { setCurrentId } = menuContext.timeOfDays;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const currentDay = getActive();

  const deleteRecipeFn = useAsyncFn(deleteRecipe);

  return (
    <>
      {currentDay?.timeOfDays.map(timeOfDay => (
        <div key={timeOfDay.id} className={styles.row}>
          <span className={styles.name}>
            {timeOfDay.name.replace('_', ' ')}
          </span>
          {timeOfDay.recipe ? (
            <div className={styles.recipeWrapper}>
              {deleteRecipeFn.loading ? (
                <Loading height='0' />
              ) : (
                <>
                  <p className={styles.recipe}>{timeOfDay.recipe.title}</p>
                  <button
                    onClick={() => {
                      deleteRecipeFn.run(timeOfDay.id).then(res => {
                        console.log(res);
                        dispatchMenus({
                          type: menuActions.removeRecipe,
                          payload: res.id,
                        });
                      });
                    }}
                  >
                    <Icon name='delete' />
                  </button>
                </>
              )}
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
          {deleteRecipeFn.errors && <Error errors={deleteRecipeFn.errors} />}
        </div>
      ))}
    </>
  );
}
