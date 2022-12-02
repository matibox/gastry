import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const { user, getUser, setLocalUser, resetUser } = useLocalUser();

  useEffect(() => {
    getUser();
  }, [getUser]);

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
  const [user, setUser] = useState<User>();

  const localStorageItemName = 'user';

  const setLocalUser = useCallback((user: User) => {
    setUser(user);
    localStorage.setItem(localStorageItemName, JSON.stringify(user));
  }, []);

  const getUser = useCallback(() => {
    const currentUser = localStorage.getItem(localStorageItemName);
    if (!currentUser) return undefined;
    setUser(JSON.parse(currentUser));
  }, []);

  const resetUser = useCallback(() => {
    localStorage.removeItem(localStorageItemName);
  }, []);

  return { user, setLocalUser, getUser, resetUser };
}
