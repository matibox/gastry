import { useState } from 'react';
import { RecipesList } from '../components/RecipesList/RecipesList';
import { Searchbar } from '../features/Search/Searchbar';
import { useAsyncFn } from '../hooks/useAsync';
import { getByQuery } from '../services/recipes';

export function Search() {
  const [query, setQuery] = useState('');
  const getRecipesByQueryFn = useAsyncFn(getByQuery);

  function searchByQuery() {
    if (query) {
      getRecipesByQueryFn.run(query).then(data => {
        return data;
      });
    }
  }

  return (
    <section
      style={{
        padding: '2.5rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <div style={{ width: '100%' }}>
        <Searchbar callback={searchByQuery} query={query} setQuery={setQuery} />
      </div>
      <RecipesList
        recipes={query ? getRecipesByQueryFn.data : []}
        error={getRecipesByQueryFn.error}
        loading={getRecipesByQueryFn.loading}
      />
    </section>
  );
}
