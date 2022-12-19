import { Filters } from '../features/Search/Filters';
import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';
import { SortBy } from '../features/Search/SortBy';
import { getLikedRecipes } from '../services/recipes';

import styles from './SearchSec.module.css';

export function Favourites() {
  return (
    <SearchContextProvider
      filtersToggle
      initialFetch
      serviceFn={getLikedRecipes}
    >
      <main className={styles.wrapper}>
        <h1>favourite recipes</h1>
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
