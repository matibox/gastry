import { createContext } from 'react';

interface recipeContextProviderProps {
  children: JSX.Element;
}

const RecipeContext = createContext({});

export function RecipeContextProvider({
  children,
}: recipeContextProviderProps) {
  return <RecipeContext.Provider value={{}}>{children}</RecipeContext.Provider>;
}
