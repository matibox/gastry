import { Icon } from '../../components/Icon/Icon';
import { useQuery } from './useQuery';
import { ChangeEvent, useState } from 'react';

// styles
import styles from './Searchbar.module.css';

export function Searchbar() {
  const [query, setQuery] = useState('');

  useQuery(
    () => {
      if (!query) return;
      // TODO SEARCH
    },
    500,
    [query]
  );

  return (
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
  );
}
