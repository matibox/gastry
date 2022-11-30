import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getFilters } from '../../services/filters';
import RecipeOverview from '../../types/RecipeOverview';
import { useQuery } from './useQuery';
import { Filters } from '../../types/Filters';
import { SortBy } from '../../types/SortBy';
import { TError } from '../../types/Error';

interface FilterObj {
  name: string;
}

interface TSearchContext {
  query: {
    data: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
  };
  recipes: {
    data: undefined | RecipeOverview[];
    loading: boolean;
    errors: undefined | TError[];
    moreToLoad: boolean;
    loadMore: () => void;
    notFound: boolean;
  };
  availFilters: {
    data: Filters[];
    loading: boolean;
    errors: undefined | TError[];
  };
  filters: {
    data: Filters[];
    setFilters: React.Dispatch<React.SetStateAction<Filters[]>>;
  };
  sortBy: {
    data: SortBy;
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  };
  optionsOpened: {
    data: boolean;
    setOptionsOpened: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: boolean;
  };
}

interface SearchContextProviderProps {
  children: JSX.Element;
  filtersToggle?: boolean;
  initialFetch?: boolean;
  serviceFn: (...props: any[]) => Promise<any>;
}

const SearchContext = createContext<TSearchContext | null>(null);

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchContextProvider({
  children,
  filtersToggle = false,
  initialFetch = false,
  serviceFn,
}: SearchContextProviderProps) {
  const [query, setQuery] = useState('');
  const { data: availFiltersData, ...availFiltersState } = useAsync(getFilters);
  const [availFilters, setAvailFilters] = useState<FilterObj[]>([]);
  const [filters, setFilters] = useState<Filters[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>(['updatedAt', 'desc']);

  const { recipes, ...recipesState } = useQuery(
    query,
    filters,
    sortBy,
    initialFetch,
    serviceFn
  );

  const [optionsOpened, setOptionsOpened] = useState(!filtersToggle);

  useEffect(() => {
    if (!availFiltersData) return;
    setAvailFilters(availFiltersData);
  }, [availFiltersData]);

  return (
    <SearchContext.Provider
      value={{
        query: {
          data: query,
          setQuery,
        },
        recipes: {
          data: recipes,
          ...recipesState,
        },
        availFilters: {
          data: availFilters.map(filter => filter.name) as Filters[],
          ...availFiltersState,
        },
        filters: {
          data: filters,
          setFilters,
        },
        sortBy: {
          data: sortBy,
          setSortBy,
        },
        optionsOpened: {
          data: optionsOpened,
          setOptionsOpened,
          toggle: filtersToggle,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
