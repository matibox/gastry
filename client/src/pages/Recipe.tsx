import { RecipeContent } from '../features/Recipe/RecipeContent';
import { RecipeContextProvider } from '../features/Recipe/recipeContext';

export function Recipe() {
  return (
    <RecipeContextProvider>
      <RecipeContent />
    </RecipeContextProvider>
  );
}
