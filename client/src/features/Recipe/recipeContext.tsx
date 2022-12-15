import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { getRecipe, getRecipeWithAuthor } from '../../services/recipes';
import { TError } from '../../types/Error';
import { Recipe } from '../../types/Recipe';

interface TRecipeContext {
  recipe: {
    id: string;
    data: undefined | Recipe;
    loading: boolean;
    errors: undefined | TError[];
    editLocalRecipe: (newRecipe: Recipe) => void;
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
  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;

  const { id } = useParams();
  if (!id) return null;

  const [recipe, setRecipe] = useState<Recipe>();

  const getRecipeWithAuthorFn = useAsyncFn(getRecipeWithAuthor);
  const getRecipeFn = useAsyncFn(getRecipe);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        getRecipeWithAuthorFn.run(id).then(setRecipe);
        return;
      }
      getRecipeFn.run(id).then(setRecipe);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [user]);

  function editLocalRecipe(newRecipe: Recipe) {
    setRecipe(prev => {
      return { ...prev, ...newRecipe };
    });
  }

  return (
    <RecipeContext.Provider
      value={{
        recipe: {
          id,
          data: recipe,
          loading: getRecipeWithAuthorFn.loading || getRecipeFn.loading,
          errors: getRecipeWithAuthorFn.errors || getRecipeFn.errors,
          editLocalRecipe,
        },
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
