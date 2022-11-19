import { createContext, useContext, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getFilters } from '../../services/filters';
import RecipeOverview from '../../types/RecipeOverview';
import { useQuery } from './useQuery';

interface TSearchContext {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  recipes: {
    data: undefined | RecipeOverview[];
    loading: boolean;
    error: undefined | string;
    moreToLoad: boolean;
    loadMore: () => void;
  };
  filters: {
    data: undefined | { name: string }[];
    loading: boolean;
    error: undefined | string;
  };
}

interface SearchContextProviderProps {
  children: JSX.Element;
}

const SearchContext = createContext<TSearchContext | null>(null);

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [query, setQuery] = useState('');
  const { recipes, ...recipesState } = useQuery(query);
  const { data: filters, ...filtersState } = useAsync(getFilters);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        recipes: {
          data: recipes,
          ...recipesState,
        },
        filters: {
          data: filters,
          ...filtersState,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
