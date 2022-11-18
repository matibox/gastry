import { createContext, useContext, useState } from 'react';

interface TSearchContext {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
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

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
