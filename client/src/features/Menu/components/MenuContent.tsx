import { AnimatePresence } from 'framer-motion';
import { Error } from '../../../components/Error/Error';
import { Icon } from '../../../components/Icon/Icon';
import Loading from '../../../components/Loading/Loading';
import styles from '../styles/MenuContent.module.css';
import { useMenu } from '../contexts/MenuContext';
import { MenuPicker } from './MenuPicker';
import { NewMenu } from './NewMenu';
import { MenuTable } from './MenuTable';
import { Days } from './Days';
import { PickRecipe } from './PickRecipe';
import { useIsMobile } from '../../../contexts/isMobileContext';

export function MenuContent() {
  const menuContext = useMenu();
  const { isMobile } = useIsMobile();

  if (!menuContext) return null;
  const { getActive, loading, errors } = menuContext.menus;
  const { menuPicker, newMenuForm, recipePick } = menuContext;
  const activeMenu = getActive();

  return (
    <>
      <AnimatePresence>{newMenuForm.isOpened && <NewMenu />}</AnimatePresence>
      <AnimatePresence>{recipePick.isOpened && <PickRecipe />}</AnimatePresence>
      {!errors ? (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className={`${styles.wrapper} ${!isMobile && styles.pc}`}>
              {isMobile && (
                <section className={styles.titleWrapper}>
                  <h2>{activeMenu?.name}</h2>
                  <button onClick={() => menuPicker.setIsOpened(true)}>
                    <Icon name='menu' />
                  </button>
                </section>
              )}
              <AnimatePresence>
                {menuPicker.isOpened && <MenuPicker />}
              </AnimatePresence>
              <section className={styles.menuWrapper}>
                {activeMenu && <Days days={activeMenu.days} />}
                {activeMenu && <MenuTable />}
              </section>
              <button
                className={styles.addBtn}
                onClick={() => newMenuForm.setIsOpened(prev => !prev)}
              >
                <Icon name={`${newMenuForm.isOpened ? 'close' : 'add'}`} />
              </button>
            </div>
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
