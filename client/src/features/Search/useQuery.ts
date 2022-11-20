import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { getByQuery } from '../../services/recipes';
import { Filters } from '../../types/Filters';
import RecipeOverview from '../../types/RecipeOverview';
import { SortBy } from '../../types/SortBy';

const QUANTITY = 3;
const DELAY = 500;

export function useQuery(query: string, filters: Filters[], sortBy: SortBy) {
  const getRecipesByQueryFn = useAsyncFn(getByQuery);
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [sortedRecipes, setSortedRecipes] = useState<RecipeOverview[]>([]);
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useDebounce(
    () => {
      if (!query && filters.length === 0) {
        setRecipes([]);
        return;
      }
      getRecipesByQueryFn.run(offset, QUANTITY, query, filters).then(data => {
        setRecipes(data.recipes);
        setMoreToLoad(data.moreToLoad);
        setNotFound(data.notFound);
      });
    },
    DELAY,
    [query, filters]
  );

  useEffect(() => {
    if (recipes.length === 0) return;
    const [item, order] = sortBy;
    setSortedRecipes(() => {
      let newRecipes = [...recipes].sort((a, b) => {
        if (item === 'updatedAt') {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        if (item === 'cookingTime') return b.cookingTime - a.cookingTime;

        return 0;
      });

      if (order === 'asc') return newRecipes.reverse();
      return newRecipes;
    });
  }, [recipes, sortBy]);

  const loadMore = useCallback(() => {
    if (!moreToLoad) return;
    getRecipesByQueryFn
      .run(offset + QUANTITY, QUANTITY, query, filters)
      .then(data => {
        setRecipes(prevRecipes => {
          return [
            ...new Map(
              [...prevRecipes, ...data.recipes].map(recipe => [
                recipe.id,
                recipe,
              ])
            ).values(),
          ];
        });
        setMoreToLoad(data.moreToLoad);
        setOffset(prevOffset => prevOffset + QUANTITY);
      });
  }, [query, moreToLoad]);

  return {
    recipes: sortedRecipes,
    loading: getRecipesByQueryFn.loading,
    error: getRecipesByQueryFn.error,
    loadMore,
    moreToLoad,
    notFound,
  };
}
