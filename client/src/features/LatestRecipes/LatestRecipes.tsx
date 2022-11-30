import { useEffect } from 'react';
import { RecipesList } from '../../components/RecipesList/RecipesList';
import { TError } from '../../types/Error';

// styles
import styles from './LatestRecipes.module.css';
import { useLatestRecipes } from './useLatestRecipes';

interface LatestRecipesProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export function LatestRecipes({ sectionRef }: LatestRecipesProps) {
  const { recipes, loading, errors, loadMore, moreToLoad } =
    useLatestRecipes(3);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <section ref={sectionRef} className={styles.wrapper}>
      <h2>our latest recipes</h2>
      <RecipesList
        recipes={recipes}
        loadMore={loadMore}
        loading={loading}
        errors={errors}
        moreToLoad={moreToLoad}
      />
    </section>
  );
}
