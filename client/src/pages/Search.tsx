import { useEffect, useRef, useState } from 'react';
import { RecipesList } from '../components/RecipesList/RecipesList';
import { Searchbar } from '../features/Search/Searchbar';
import { useAsyncFn } from '../hooks/useAsync';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLoadMore } from '../hooks/useLoadMore';
import { getByQuery } from '../services/recipes';

export function Search() {
  const [query, setQuery] = useState('');
  const getRecipesByQueryFn = useAsyncFn(getByQuery);
  const {
    data: recipes,
    error,
    loading,
    loadMore,
  } = useLoadMore(6, getRecipesByQueryFn);
  const lastElRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(lastElRef, {
    threshold: 1,
  });

  function searchByQuery() {
    if (query) {
      loadMore(query);
    }
  }

  useEffect(() => {
    console.log(isIntersecting);
  }, [isIntersecting]);

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
      ref={lastElRef}
    >
      <div style={{ width: '100%' }}>
        <Searchbar callback={searchByQuery} query={query} setQuery={setQuery} />
      </div>
      <RecipesList
        recipes={query ? recipes : []}
        error={error}
        loading={loading}
        loadMore={loadMore}
        lastElRef={lastElRef}
      />
    </section>
  );
}
