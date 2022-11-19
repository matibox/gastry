import { Checkbox } from '../../components/Checkbox/Checkbox';
import Loading from '../../components/Loading/Loading';
import styles from './Filters.module.css';
import { useSearch } from './searchContext';

export function Filters() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { availFilters } = searchContext;

  return (
    <div className={styles.wrapper}>
      <span>filter by</span>
      <div
        className={`${styles.optionsWrapper} ${
          availFilters.loading && styles.loading
        }`}
      >
        {availFilters.data.map(filter => (
          <Checkbox key={filter} label={filter} />
        ))}
        {availFilters.loading && <Loading />}
        {availFilters.error && <p>Error</p>}
      </div>
    </div>
  );
}
