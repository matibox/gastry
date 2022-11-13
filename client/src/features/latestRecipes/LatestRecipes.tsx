import { RecipesList } from '../../components/RecipesList/RecipesList';
import RecipeOverview from '../../types/RecipeOverview';

// styles
import styles from './LatestRecipes.module.css';

interface LatestRecipesProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const placeHolderRecipes: RecipeOverview[] = [
  {
    id: 'a',
    title: 'foo',
    cookingTime: 45,
    imgURL: 'https://unsplash.it/334/223',
  },
];

export function LatestRecipes({ sectionRef }: LatestRecipesProps) {
  return (
    <section ref={sectionRef} className={styles.wrapper}>
      <h2>our latest recipes</h2>
      <RecipesList recipes={placeHolderRecipes} />
    </section>
  );
}
