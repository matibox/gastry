import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useSearch } from './searchContext';

export function SearchResults() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data, loading, error, loadMore, moreToLoad } = searchContext.recipes;
  return (
    <>
      {data && data.length > 0 && (
        <h1
          style={{
            alignSelf: 'flex-start',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: '500',
            fontSize: '2.4rem',
          }}
        >
          Found {data.length} recipe{data.length > 1 && 's'}
        </h1>
      )}
      <RecipesList
        recipes={data}
        loading={loading}
        error={error}
        loadMore={loadMore}
        moreToLoad={moreToLoad}
      />
    </>
  );
}
