import { createContext, useContext, useReducer, useState } from 'react';

import { Menu } from '../../types/Menu';

interface MenuContext {
  menus: {
    data: Menu[];
    dispatchMenus: React.Dispatch<Action>;
    menuActions: typeof menuActions;
  };
}

const MenuContext = createContext<MenuContext | null>(null);

export function useMenu() {
  return useContext(MenuContext);
}

enum menuActions {
  setActive = 'SET_ACTIVE',
  setEditing = 'SET_EDITING',
}

interface Action {
  type: menuActions;
  payload: Menu;
}

function menusReducer(state: Menu[], action: Action) {
  switch (action.type) {
    case menuActions.setActive:
      return state.map(prevMenu => {
        if (prevMenu.name === action.payload.name)
          return { ...prevMenu, isActive: true };
        return { ...prevMenu, isActive: false };
      });
    case menuActions.setEditing:
      return state.map(prevMenu => {
        if (prevMenu.name === action.payload.name)
          return { ...prevMenu, isEditing: !prevMenu.isEditing };
        return { ...prevMenu, isEditing: false };
      });
    default:
      return state;
  }
}

interface MenuContextProviderProps {
  children: JSX.Element;
}

export function MenuContextProvider({ children }: MenuContextProviderProps) {
  //! temporary

  const [state, dispatch] = useReducer(menusReducer, [
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
    <MenuContext.Provider
      value={{ menus: { data: state, dispatchMenus: dispatch, menuActions } }}
    >
      {children}
    </MenuContext.Provider>
  );
}
