import Recipe from '../../types/RecipeOverview';
import { RecipeOverview } from '../RecipeOverview/RecipeOverview';

interface RecipesListProps {
  recipes: Recipe[];
}

export function RecipesList({ recipes }: RecipesListProps) {
  return (
    <>
      {recipes.map(recipe => (
        <RecipeOverview key={recipe.id} recipe={recipe} />
      ))}
    </>
  );
}
