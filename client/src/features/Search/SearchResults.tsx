import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useSearch } from './searchContext';

export function SearchResults() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data, loading, errors, loadMore, moreToLoad } = searchContext.recipes;

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
          {data.length > 0 && !errors && (
            <>
              Found {data.length} recipe{data.length > 1 && 's'}
            </>
          )}
        </h1>
      )}
      <RecipesList
        recipes={data}
        loading={loading}
        errors={errors}
        loadMore={loadMore}
        moreToLoad={moreToLoad}
        errorsCentered={true}
      />
    </>
  );
}
