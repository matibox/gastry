import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { useLike } from '../../hooks/useLike';
import { dislikeRecipe, getIsLiked, likeRecipe } from '../../services/recipes';
import Recipe from '../../types/RecipeOverview';
import { Error } from '../Error/Error';
import { Icon } from '../Icon/Icon';
import Loading from '../Loading/Loading';

// styles
import styles from './RecipeOverview.module.css';

interface RecipeOverviewProps {
  recipe: Recipe;
}

export function RecipeOverview({ recipe }: RecipeOverviewProps) {
  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;
  const { isFav, toggleLike, loading, errors } = useLike(user, recipe.id);

  return (
    <div className={styles.wrapper}>
      <Link
        className={styles.link}
        to={`/recipes/${recipe.id}`}
        style={{ backgroundImage: `url(${recipe.thumbnail})` }}
      />
      <div className={styles.infoWrapper}>
        <h3>{recipe.title}</h3>
        <div className={styles.timer}>
          <Icon name='timer' />
          <span>{recipe.cookingTime}</span>
        </div>
        <Link to={`/recipes/${recipe.id}`} className='button'>
          <span>cook now</span>
          <Icon name='restaurant' />
        </Link>
        {user && (
          <button
            onClick={toggleLike}
            className={`${styles.favBtn} ${isFav && styles.favActive}`}
            disabled={loading}
          >
            <Icon name='favorite' isFilled={isFav} />
          </button>
        )}
        {errors && <Error errors={errors} />}
      </div>
    </div>
  );
}
