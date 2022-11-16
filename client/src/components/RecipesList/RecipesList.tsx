import { Link } from 'react-router-dom';
import Recipe from '../../types/RecipeOverview';
import { Icon } from '../Icon/Icon';
import Loading from '../Loading/Loading';
import { RecipeOverview } from '../RecipeOverview/RecipeOverview';

interface RecipesListProps {
  recipes: undefined | Recipe[];
  loadMore?: () => void;
  loading: boolean;
  error: any;
  moreToLoad: boolean;
  loggedIn?: boolean;
}

export function RecipesList({
  recipes,
  loadMore,
  loading,
  error,
  moreToLoad,
  loggedIn = true,
}: RecipesListProps) {
  if (error) return <p>Error</p>;

  return (
    <>
      {loggedIn ? (
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
      ) : (
        <>
          <p style={{ fontSize: '1.75em' }}>
            please login in order to add recipes
          </p>
          <Link
            to='/login'
            className='button'
            style={{ color: 'var(--black)' }}
          >
            <span>login</span>
            <Icon name='login' />
          </Link>
        </>
      )}
    </>
  );
}
