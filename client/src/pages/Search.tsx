import { Searchbar } from '../features/Search/Searchbar';
import { SearchContextProvider } from '../features/Search/searchContext';
import { SearchResults } from '../features/Search/SearchResults';

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
        <section style={{ width: '100%' }}>
          <Searchbar />
        </section>
        <SearchResults />
      </main>
    </SearchContextProvider>
  );
}
