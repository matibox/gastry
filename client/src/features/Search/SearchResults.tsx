import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useSearch } from './searchContext';

export function SearchResults() {
  const searchContext = useSearch();
  if (!searchContext) return null;
  const { recipes, loading, error, loadMore, moreToLoad } = searchContext;
  return (
    <RecipesList
      recipes={recipes}
      loading={loading}
      error={error}
      loadMore={loadMore}
      moreToLoad={moreToLoad}
    />
  );
}
