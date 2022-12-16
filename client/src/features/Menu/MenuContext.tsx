import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from 'react';

import { Menu } from '../../types/Menu';
import { usePopupToggle } from './usePopupToggle';

interface MenuContext {
  menus: {
    data: Menu[];
    dispatchMenus: React.Dispatch<Action>;
    menuActions: typeof menuActions;
    getActive: () => Menu | null;
  };
  menuPicker: {
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  };
  newMenuForm: {
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const MenuContext = createContext<MenuContext | null>(null);

export function useMenu() {
  return useContext(MenuContext);
}

enum menuActions {
  setActive = 'SET_ACTIVE',
  setEditing = 'SET_EDITING',
  editNameAndClose = 'EDIT_NAME_AND_CLOSE',
  addLocalMenu = 'ADD',
}

interface Action {
  type: menuActions;
  payload: Menu;
}

function menusReducer(state: Menu[], action: Action) {
  switch (action.type) {
    case menuActions.setActive:
      return state.map(prevMenu => {
        if (prevMenu.id === action.payload.id)
          return { ...prevMenu, isActive: true };
        return { ...prevMenu, isActive: false };
      });
    case menuActions.setEditing:
      return state.map(prevMenu => {
        if (prevMenu.id === action.payload.id)
          return { ...prevMenu, isEditing: !prevMenu.isEditing };
        return { ...prevMenu, isEditing: false };
      });
    case menuActions.editNameAndClose:
      return state.map(prevMenu => {
        if (prevMenu.id === action.payload.id) {
          return { ...prevMenu, name: action.payload.name, isEditing: false };
        }
        return { ...prevMenu, isEditing: false };
      });
    case menuActions.addLocalMenu:
      return [...state, action.payload];
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
      id: '1',
      name: 'Menu 1',
      isActive: true,
      isEditing: false,
      days: [
        {
          id: '1',
          name: 'monday',
          timeOfDays: [
            {
              id: '1',
              name: 'morning',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Menu 2',
      isActive: false,
      isEditing: false,
      days: [
        {
          id: '2',
          name: 'tuesday',
          timeOfDays: [
            {
              id: '2',
              name: 'evening',
            },
          ],
        },
      ],
    },
  ]);

  const [isMenuPickerOpened, setIsMenuPickerOpened] = useState(false);
  const [isNewMenuFormOpened, setIsNewMenuFormOpened] = useState(false);

  usePopupToggle([
    {
      state: isMenuPickerOpened,
      setState: setIsMenuPickerOpened,
    },
    {
      state: isNewMenuFormOpened,
      setState: setIsNewMenuFormOpened,
    },
  ]);

  const getActive = useCallback(() => {
    const foundActive = state.find(menu => menu.isActive);
    if (!foundActive) return null;
    return foundActive;
  }, [state]);

  return (
    <MenuContext.Provider
      value={{
        menus: {
          data: state,
          dispatchMenus: dispatch,
          menuActions,
          getActive,
        },
        menuPicker: {
          isOpened: isMenuPickerOpened,
          setIsOpened: setIsMenuPickerOpened,
        },
        newMenuForm: {
          isOpened: isNewMenuFormOpened,
          setIsOpened: setIsNewMenuFormOpened,
        },
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
