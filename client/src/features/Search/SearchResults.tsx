import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useSearch } from './searchContext';

export function SearchResults() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data, loading, error, loadMore, moreToLoad, notFound } =
    searchContext.recipes;

  return (
    <>
      {data && (
        <h1
          style={{
            alignSelf: 'flex-start',
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: '500',
            fontSize: '2.4rem',
          }}
        >
          {!notFound && (
            <>
              Found {data.length} recipe{data.length > 1 && 's'}
            </>
          )}
          {notFound && <>No recipes found</>}
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
