import { Filters } from '../features/Search/Filters';
import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';
import { SortBy } from '../features/Search/SortBy';

import styles from './Search.module.css';

export function Search() {
  return (
    <SearchContextProvider>
      <main className={styles.wrapper}>
        <section className={styles.searchWrapper}>
          <Searchbar />
          <Filters />
          <SortBy />
        </section>
        <SearchResults />
      </main>
    </SearchContextProvider>
  );
}
