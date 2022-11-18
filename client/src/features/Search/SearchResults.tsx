import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useSearch } from './searchContext';

export function SearchResults() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { data, loading, error, loadMore, moreToLoad } = searchContext.recipes;
  return (
    <RecipesList
      recipes={data}
      loading={loading}
      error={error}
      loadMore={loadMore}
      moreToLoad={moreToLoad}
    />
  );
}
