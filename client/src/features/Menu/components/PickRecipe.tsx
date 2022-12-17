import { motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { Icon } from '../../../components/Icon/Icon';
import { useAsyncFn } from '../../../hooks/useAsync';
import { useDebounce } from '../../../hooks/useDebounce';
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

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);

  const getRecipesToPickFn = useAsyncFn(getRecipesToPick);

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
        <ul className={styles.results}>
          {results.map(result => (
            <li key={result.id} className={styles.result}>
              {result.title}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
