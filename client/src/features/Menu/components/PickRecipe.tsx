import { motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { Error } from '../../../components/Error/Error';
import { Icon } from '../../../components/Icon/Icon';
import Loading from '../../../components/Loading/Loading';
import { useAsyncFn } from '../../../hooks/useAsync';
import { useDebounce } from '../../../hooks/useDebounce';
import { setRecipe } from '../../../services/menu';
import { getRecipesToPick } from '../../../services/recipes';
import { useMenu } from '../contexts/MenuContext';
import styles from '../styles/PickRecipe.module.css';

interface Recipe {
  id: string;
  title: string;
}

export function PickRecipe() {
  const menuContext = useMenu();
  if (!menuContext) return null;
  const { setIsOpened } = menuContext.recipePick;
  const { dispatchMenus, menuActions } = menuContext.menus;
  const { currentId, setCurrentId } = menuContext.timeOfDays;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);

  const getRecipesToPickFn = useAsyncFn(getRecipesToPick);
  const setRecipeFn = useAsyncFn(setRecipe);

  useDebounce(
    () => {
      if (!query) return;
      getRecipesToPickFn.run(query).then(res => {
        setResults(res);
      });
    },
    500,
    [query]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        className={styles.overlay}
        onClick={() => setIsOpened(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: 'backOut',
        }}
        className={styles.wrapper}
      >
        <h3>Pick recipe</h3>
        <label className={styles.search}>
          <Icon name='search' />
          <input
            type='text'
            className={styles.input}
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
        </label>
        {setRecipeFn.errors && <Error errors={setRecipeFn.errors} />}
        {getRecipesToPickFn.errors && (
          <Error errors={getRecipesToPickFn.errors} />
        )}
        {setRecipeFn.loading && <Loading height='0' />}
        {getRecipesToPickFn.loading && <Loading height='0' />}
        <ul className={styles.results}>
          {results.map(result => (
            <li
              key={result.id}
              className={styles.result}
              onClick={() => {
                if (!currentId) return;
                setRecipeFn.run(result.id, currentId).then(res => {
                  dispatchMenus({
                    type: menuActions.setRecipe,
                    payload: {
                      id: res.recipe.id,
                      timeOfDayId: res.id,
                      title: res.recipe.title,
                    },
                  });
                  setTimeout(() => {
                    setIsOpened(false);
                    setCurrentId(null);
                  }, 250);
                });
              }}
            >
              {result.title}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
