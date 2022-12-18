import { useState } from 'react';
import { Link } from 'react-router-dom';
import Recipe from '../../types/RecipeOverview';
import { Icon } from '../Icon/Icon';

// styles
import styles from './RecipeOverview.module.css';

interface RecipeOverviewProps {
  recipe: Recipe;
  lastElRef?: React.RefObject<HTMLDivElement>;
}

export function RecipeOverview({ recipe, lastElRef }: RecipeOverviewProps) {
  //TODO get favorite data from API
  //TODO more info on PC
  const [isFav, setIsFav] = useState(false);

  return (
    <div className={styles.wrapper} ref={lastElRef}>
      <Link
        className={styles.link}
        to={`/recipes/${recipe.id}`}
        style={{ backgroundImage: `url(${recipe.thumbnail})` }}
      >
        {/* <img
          className={styles.thumbnail}
          src={recipe.thumbnail}
          alt={recipe.title}
        /> */}
      </Link>
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
        <button
          onClick={() => setIsFav(prev => !prev)}
          className={`${styles.favBtn} ${isFav && styles.favActive}`}
        >
          <Icon name='favorite' isFilled={isFav} />
        </button>
      </div>
    </div>
  );
}
