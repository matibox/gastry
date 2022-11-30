import { useEffect, useRef } from 'react';
import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useYourRecipes } from './useYourRecipes';
import styles from './YourRecipes.module.css';

export function YourRecipes() {
  const sectionRef = useRef(null);
  const { recipes, loading, errors, loadMore, moreToLoad } = useYourRecipes(3);
  const { isIntersecting } = useIntersectionObserver(sectionRef);

  useEffect(() => {
    if (!isIntersecting) return;
    loadMore();
  }, [isIntersecting]);

  return (
    <section className={styles.wrapper} ref={sectionRef}>
      <h2>your recipes</h2>
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
