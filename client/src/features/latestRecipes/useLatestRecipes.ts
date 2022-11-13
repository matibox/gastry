import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from '../../hooks/useAsync';
import { getLatestRecipes } from '../../services/recipes';
import Recipe from '../../types/RecipeOverview';

export function useLatestRecipes(quantity: number) {
  const getLatestRecipesFn = useAsyncFn(getLatestRecipes);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(true);

  const loadMore = useCallback(() => {
    if (!moreToLoad) return;
    getLatestRecipesFn.run(offset, quantity).then(newRecipes => {
      let length = recipes.length;
      setRecipes(prevRecipes => {
        return [
          ...new Map(
            [...prevRecipes, ...newRecipes].map(recipe => [recipe.id, recipe])
          ).values(),
        ];
      });
      if (recipes.length === length) {
        setMoreToLoad(false);
        return;
      }
      setOffset(prevOffset => prevOffset + quantity);
    });
  }, []);

  return {
    recipes,
    loading: getLatestRecipesFn.loading,
    error: getLatestRecipesFn.error,
    loadMore,
    moreToLoad,
  };
}
