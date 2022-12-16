import { useEffect } from 'react';
import { RecipesList } from '../../components/RecipesList/RecipesList';
import { useAsync } from '../../hooks/useAsync';
import { getYourLatestRecipes } from '../../services/recipes';
import styles from './YourRecipes.module.css';

export function YourRecipes() {
  const { data: recipes, loading, errors } = useAsync(getYourLatestRecipes);

  useEffect(() => {
    console.log(recipes);
  }, [recipes]);

  return (
    <section className={styles.wrapper}>
      <h2>your latest recipes</h2>
      <RecipesList recipes={recipes} loading={loading} errors={errors} />
    </section>
  );
}
