import { Icon } from '../../components/Icon/Icon';
import { ChangeEvent } from 'react';
import { useSearch } from './searchContext';

// styles
import styles from './Searchbar.module.css';

export function Searchbar() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data: query, setQuery } = searchContext.query;

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
      </div>
    </>
  );
}
