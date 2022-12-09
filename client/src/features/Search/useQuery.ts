import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { Filters } from '../../types/Filters';
import RecipeOverview from '../../types/RecipeOverview';
import { SortBy } from '../../types/SortBy';

const QUANTITY = 3;
const DELAY = 500;

export function useQuery(
  query: string,
  filters: Filters[],
  sortBy: SortBy,
  initialFetch: boolean = false,
  serviceFn: (...props: any[]) => Promise<any>
) {
  const getRecipes = useAsyncFn(serviceFn);
  const [recipes, setRecipes] = useState<RecipeOverview[]>([]);
  const [sortedRecipes, setSortedRecipes] = useState<RecipeOverview[]>([]);
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(false);

  // query/filters change
  useDebounce(
    () => {
      setOffset(0);
      if (!query && filters.length === 0 && !initialFetch) {
        setRecipes([]);
        return;
      }
      getRecipes.run(0, QUANTITY, query, filters).then(data => {
        setRecipes(data.recipes);
        setMoreToLoad(data.moreToLoad);
        setOffset(prevOffset => prevOffset + data.recipes.length);
      });
    },
    DELAY,
    [query, filters, initialFetch]
  );

  // sorting
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

  // load more
  const loadMore = useCallback(() => {
    if (!moreToLoad) return;
    getRecipes.run(offset, QUANTITY, query, filters).then(data => {
      setRecipes(prevRecipes => {
        return [
          ...new Map(
            [...prevRecipes, ...data.recipes].map(recipe => [recipe.id, recipe])
          ).values(),
        ];
      });
      setMoreToLoad(data.moreToLoad);
      setOffset(prevOffset => prevOffset + data.recipes.length);
    });
  }, [query, moreToLoad, offset]);

  return {
    recipes: recipes.length > 0 ? sortedRecipes : recipes,
    setRecipes,
    loading: getRecipes.loading,
    errors: getRecipes.errors,
    loadMore,
    moreToLoad,
  };
}
