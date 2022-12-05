import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { AddRecipeForm } from '../features/AddRecipeForm/AddRecipeForm';
import { Filters } from '../features/Search/Filters';
import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';
import { SortBy } from '../features/Search/SortBy';
import { getByQuery } from '../services/recipes';

import styles from './SearchSec.module.css';

export function YourRecipes() {
  const [isFormOpened, setIsFormOpened] = useState(false);

  return (
    <SearchContextProvider filtersToggle initialFetch serviceFn={getByQuery}>
      <main className={styles.wrapper} style={{ position: 'relative' }}>
        <AnimatePresence>{isFormOpened && <AddRecipeForm />}</AnimatePresence>
        <h1>your recipes</h1>
        <section className={styles.searchWrapper}>
          <Searchbar />
          <Filters />
          <SortBy />
        </section>
        <SearchResults />
        <button
          className={styles.addBtn}
          onClick={() => setIsFormOpened(prev => !prev)}
        >
          <Icon name={`${isFormOpened ? 'close' : 'add'}`} />
        </button>
      </main>
    </SearchContextProvider>
  );
}
