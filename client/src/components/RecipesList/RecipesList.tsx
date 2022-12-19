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
  errorsCentered?: boolean;
}

export function RecipesList({
  recipes,
  loadMore,
  loading,
  errors,
  moreToLoad,
  errorsCentered,
}: RecipesListProps) {
  if (errors)
    return (
      <Error
        errors={errors}
        color='black'
        size='large'
        centered={errorsCentered}
      />
    );

  return (
    <>
      {!loading && (
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {recipes?.map((recipe, i) => (
            <RecipeOverview key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
      {loading && <Loading />}
      {loadMore && moreToLoad && !loading && (
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
