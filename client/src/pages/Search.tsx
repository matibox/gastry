import { Filters } from '../features/Search/Filters';
import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';
import { SortBy } from '../features/Search/SortBy';

export function Search() {
  return (
    <SearchContextProvider>
      <main
        style={{
          padding: '2.5rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <section
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Searchbar />
          <Filters />
          <SortBy />
        </section>
        <SearchResults />
      </main>
    </SearchContextProvider>
  );
}
