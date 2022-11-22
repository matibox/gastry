import { createContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getRecipe } from '../../services/recipes';
import { Recipe } from '../../types/Recipe';

interface TRecipeContext {
  recipe: {
    id: string;
    data: undefined | Recipe;
    loading: boolean;
    error: undefined | string;
  };
}

interface recipeContextProviderProps {
  children: JSX.Element;
}

const RecipeContext = createContext<TRecipeContext | null>(null);

export function RecipeContextProvider({
  children,
}: recipeContextProviderProps) {
  const { id } = useParams();
  if (!id) return null;
  const { ...recipeState } = useAsync(() => getRecipe(id), [id]);

  return (
    <RecipeContext.Provider
      value={{
        recipe: {
          id,
          ...recipeState,
        },
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
