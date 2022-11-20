import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import Loading from '../../components/Loading/Loading';
import styles from './Filters.module.css';
import { useSearch } from './searchContext';

export function Filters() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { availFilters, optionsOpened } = searchContext;

  return (
    <AnimatePresence>
      {optionsOpened.data && (
        <motion.div
          className={styles.wrapper}
          initial={optionsOpened.toggle ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeIn',
          }}
        >
          <span>filter by</span>
          <div
            className={`${styles.optionsWrapper} ${
              availFilters.loading && styles.loading
            }`}
          >
            {availFilters.data.map(filter => (
              <Checkbox key={filter} label={filter} />
            ))}
            {availFilters.loading && <Loading height='100%' />}
            {availFilters.error && <p>Error</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
