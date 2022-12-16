import { createContext, useContext, useState } from 'react';

import { Menu } from '../../types/Menu';

interface MenuContext {
  menus: {
    data: Menu[];
    setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  };
}

const MenuContext = createContext<MenuContext | null>(null);

export function useMenu() {
  return useContext(MenuContext);
}

interface MenuContextProviderProps {
  children: JSX.Element;
}

export function MenuContextProvider({ children }: MenuContextProviderProps) {
  //! temporary
  const [menus, setMenus] = useState<Menu[]>([
    {
      name: 'Menu 1',
      isActive: true,
      isEditing: false,
    },
    {
      name: 'Menu 2',
      isActive: false,
      isEditing: false,
    },
  ]);

  return (
    <MenuContext.Provider value={{ menus: { data: menus, setMenus } }}>
      {children}
    </MenuContext.Provider>
  );
}
