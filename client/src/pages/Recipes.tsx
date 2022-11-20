import { Filters } from '../features/Search/Filters';
import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';
import { SortBy } from '../features/Search/SortBy';

import styles from './SearchSec.module.css';

export function YourRecipes() {
  return (
    <SearchContextProvider filtersToggle>
      <main className={styles.wrapper}>
        <h1>your recipes</h1>
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
