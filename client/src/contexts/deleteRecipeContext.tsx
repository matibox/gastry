import { createContext, useContext, useState } from 'react';

interface DeleteRecipeContext {
  isDeleted: boolean | undefined;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const DeleteRecipeContext = createContext<DeleteRecipeContext | null>(null);

export function useDeleteRecipe() {
  return useContext(DeleteRecipeContext);
}

interface DeleteRecipeContextProviderProps {
  children: JSX.Element;
}

export function DeleteRecipeContextProvider({
  children,
}: DeleteRecipeContextProviderProps) {
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);

  return (
    <DeleteRecipeContext.Provider
      value={{
        isDeleted,
        setIsDeleted,
      }}
    >
      {children}
    </DeleteRecipeContext.Provider>
  );
}
