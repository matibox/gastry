import { Icon } from '../../components/Icon/Icon';
import { useQuery } from './useQuery';
import { ChangeEvent } from 'react';

// styles
import styles from './Searchbar.module.css';

interface SearchbarProps {
  callback: () => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export function Searchbar({ callback, query, setQuery }: SearchbarProps) {
  useQuery(callback, 500, [query]);

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
