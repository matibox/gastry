import { Icon } from '../../components/Icon/Icon';
import { ChangeEvent } from 'react';
import { useSearch } from './searchContext';

// styles
import styles from './Searchbar.module.css';

export function Searchbar() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data: query, setQuery } = searchContext.query;
  const {
    data: optionsOpened,
    setOptionsOpened,
    toggle,
  } = searchContext.optionsOpened;

  return (
    <>
      <div className={styles.wrapper}>
        <input
          type='text'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          value={query}
          placeholder='search recipes'
        />
        <Icon name='search' />
        {toggle && (
          <button
            className={`${styles.filtersToggle} ${
              optionsOpened && styles.active
            }`}
            onClick={() => setOptionsOpened(prev => !prev)}
          >
            <Icon name='tune' />
          </button>
        )}
      </div>
    </>
  );
}
