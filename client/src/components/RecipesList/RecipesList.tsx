import Recipe from '../../types/RecipeOverview';
import Loading from '../Loading/Loading';
import { RecipeOverview } from '../RecipeOverview/RecipeOverview';

interface RecipesListProps {
  recipes: undefined | Recipe[];
  loadMore?: () => void;
  loading: boolean;
  error: any;
  moreToLoad: boolean;
}

export function RecipesList({
  recipes,
  loadMore,
  loading,
  error,
  moreToLoad,
}: RecipesListProps) {
  if (error) return <p>Error</p>;

  return (
    <>
      {recipes?.map(recipe => (
        <RecipeOverview key={recipe.id} recipe={recipe} />
      ))}
      {loading && <Loading />}
      {loadMore && moreToLoad && (
        <button
          className='button'
          onClick={loadMore}
          style={{ color: 'var(--black)' }}
        >
          Load more
        </button>
      )}
    </>
  );
}
