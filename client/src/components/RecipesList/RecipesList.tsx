import { TError } from '../../types/Error';
import Recipe from '../../types/RecipeOverview';
import { Error } from '../Error/Error';
import Loading from '../Loading/Loading';
import { RecipeOverview } from '../RecipeOverview/RecipeOverview';

interface RecipesListProps {
  recipes: undefined | Recipe[];
  loadMore?: () => void;
  loading: boolean;
  errors: undefined | TError[];
  moreToLoad?: boolean;
  needsAuth?: boolean;
}

export function RecipesList({
  recipes,
  loadMore,
  loading,
  errors,
  moreToLoad,
}: RecipesListProps) {
  if (errors) return <Error errors={errors} color='black' size='large' />;

  return (
    <>
      {!loading &&
        recipes?.map((recipe, i) => (
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
