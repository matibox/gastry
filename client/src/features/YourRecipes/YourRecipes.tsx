import { useEffect } from 'react';
import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useYourRecipes } from './useYourRecipes';
import styles from './YourRecipes.module.css';

export function YourRecipes() {
  const { recipes, loading, error, loadMore, moreToLoad } = useYourRecipes(3);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <section className={styles.wrapper}>
      <h2>your recipes</h2>
      <RecipesList
        recipes={recipes}
        loadMore={loadMore}
        loading={loading}
        error={error}
        moreToLoad={moreToLoad}
      />
    </section>
  );
}
