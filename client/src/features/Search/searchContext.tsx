import { createContext, useContext, useState } from 'react';
import RecipeOverview from '../../types/RecipeOverview';
import { useQuery } from './useQuery';

interface TSearchContext {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  recipes: undefined | RecipeOverview[];
  loading: boolean;
  error: undefined | string;
  moreToLoad: boolean;
  loadMore: () => void;
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
  const { recipes, loading, error, moreToLoad, loadMore } = useQuery(query);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        recipes,
        loading,
        error,
        moreToLoad,
        loadMore,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
