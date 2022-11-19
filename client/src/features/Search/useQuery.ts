import { useCallback, useState } from 'react';
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
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(false);

  useDebounce(
    () => {
      if (!query && filters.length === 0 && sortBy.length === 0) {
        setRecipes([]);
        return;
      }
      getRecipesByQueryFn
        .run(offset, QUANTITY, query, filters, sortBy)
        .then(data => {
          setRecipes(data.recipes);
          setMoreToLoad(data.moreToLoad);
        });
    },
    DELAY,
    [query, filters, sortBy]
  );

  const loadMore = useCallback(() => {
    if (!moreToLoad) return;
    getRecipesByQueryFn
      .run(offset + QUANTITY, QUANTITY, query, filters, sortBy)
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
    recipes,
    loading: getRecipesByQueryFn.loading,
    error: getRecipesByQueryFn.error,
    loadMore,
    moreToLoad,
  };
}
