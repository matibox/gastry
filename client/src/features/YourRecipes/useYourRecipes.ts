import { useEffect, useState } from 'react';
import { useAsyncFn } from '../../hooks/useAsync';
import { useLoadMore } from '../../hooks/useLoadMore';
import { getYourRecipes } from '../../services/recipes';
import Recipe from '../../types/RecipeOverview';

export function useYourRecipes(quantity: number) {
  const getLatestRecipesFn = useAsyncFn(getYourRecipes);
  const { data, ...state } = useLoadMore(quantity, getLatestRecipesFn);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(data);
  }, [data]);

  return {
    recipes,
    ...state,
  };
}
