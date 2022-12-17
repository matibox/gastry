import { AnimatePresence } from 'framer-motion';
import { Error } from '../../components/Error/Error';
import { Icon } from '../../components/Icon/Icon';
import Loading from '../../components/Loading/Loading';
import styles from './MenuContent.module.css';
import { useMenu } from './MenuContext';
import { MenuPicker } from './MenuPicker';
import { NewMenu } from './NewMenu';

export function MenuContent() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { getActive, loading, errors } = menuContext.menus;
  const { menuPicker, newMenuForm } = menuContext;
  const activeMenu = getActive();

  return (
    <>
      <AnimatePresence>{menuPicker.isOpened && <MenuPicker />}</AnimatePresence>
      <AnimatePresence>{newMenuForm.isOpened && <NewMenu />}</AnimatePresence>
      {!errors ? (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              <section className={styles.titleWrapper}>
                <h2>{activeMenu?.name}</h2>
                <button onClick={() => menuPicker.setIsOpened(true)}>
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
          )}
        </>
      ) : (
        <>
          <Error errors={errors} centered color='var(--black)' />
          {errors[0].message === 'Add menus to begin!' && (
            <button
              className={styles.addBtn}
              onClick={() => newMenuForm.setIsOpened(prev => !prev)}
            >
              <Icon name={`${newMenuForm.isOpened ? 'close' : 'add'}`} />
            </button>
          )}
        </>
      )}
    </>
  );
}
