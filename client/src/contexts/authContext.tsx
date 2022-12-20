import { createContext, useCallback, useContext, useState } from 'react';
import { User } from '../types/User';

interface AuthContext {
  user: User | undefined;
  setLocalUser: (user: User) => void;
  resetUser: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

interface authContextProviderProps {
  children: JSX.Element;
}

export function AuthContextProvider({ children }: authContextProviderProps) {
  const { user, setLocalUser, resetUser } = useLocalUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        setLocalUser,
        resetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useLocalUser() {
  const localStorageItemName = 'user';

  const [user, setUser] = useState<User>(() => {
    const currentUser = localStorage.getItem(localStorageItemName);
    if (!currentUser) return undefined;
    return JSON.parse(currentUser);
  });

  const setLocalUser = useCallback((user: User) => {
    setUser(user);
    localStorage.setItem(localStorageItemName, JSON.stringify(user));
  }, []);

  const resetUser = useCallback(() => {
    localStorage.removeItem(localStorageItemName);
  }, []);

  return { user, setLocalUser, resetUser };
}
