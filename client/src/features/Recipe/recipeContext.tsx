import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getRecipe } from '../../services/recipes';
import { TError } from '../../types/Error';
import { Recipe } from '../../types/Recipe';

interface TRecipeContext {
  recipe: {
    id: string;
    data: undefined | Recipe;
    loading: boolean;
    errors: undefined | TError[];
  };
}

interface recipeContextProviderProps {
  children: JSX.Element;
}

const RecipeContext = createContext<TRecipeContext | null>(null);

export function useRecipe() {
  return useContext(RecipeContext);
}

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
