import { useState } from 'react';
import { Link } from 'react-router-dom';
import Recipe from '../../types/RecipeOverview';

// styles
import styles from './RecipeOverview.module.css';

interface RecipeOverviewProps {
  recipe: Recipe;
}

export function RecipeOverview({ recipe }: RecipeOverviewProps) {
  //TODO get favorite data from API
  //TODO more info on PC
  const [isFav, setIsFav] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Link className={styles.link} to={`/recipes/${recipe.id}`}>
        <img
          className={styles.thumbnail}
          src={recipe.thumbnail}
          alt={recipe.title}
        />
      </Link>
      <div className={styles.infoWrapper}>
        <h3>{recipe.title}</h3>
        <div className={styles.timer}>
          <span className='material-symbols-outlined icons-normal'>timer</span>
          <span>{recipe.cookingTime}</span>
        </div>
        <Link to={`/recipes/${recipe.id}`} className='button'>
          <span>cook now</span>
          <span className='material-symbols-outlined icons-normal'>
            restaurant
          </span>
        </Link>
        <button
          onClick={() => setIsFav(prev => !prev)}
          className={`${styles.favBtn} ${isFav && styles.favActive}`}
        >
          <span
            className={`material-symbols-outlined ${
              isFav ? 'icons-filled' : 'icons-normal'
            }`}
          >
            favorite
          </span>
        </button>
      </div>
    </div>
  );
}
