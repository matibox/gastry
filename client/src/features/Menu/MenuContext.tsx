import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from 'react';
import { useGetMenus } from './useGetMenus';
import { Menu } from '../../types/Menu';
import { usePopupToggle } from './usePopupToggle';
import { TError } from '../../types/Error';

interface MenuContext {
  menus: {
    data: Menu[];
    dispatchMenus: React.Dispatch<Action>;
    menuActions: typeof menuActions;
    getActive: () => Menu | null;
    loading: boolean;
    errors: TError[] | undefined;
    resetErrors: () => void;
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

export enum menuActions {
  setActive = 'SET_ACTIVE',
  setEditing = 'SET_EDITING',
  editNameAndClose = 'EDIT_NAME_AND_CLOSE',
  addLocalMenu = 'ADD',
  getAll = 'GET_MENUS',
  delete = 'DELETE',
}

export type Action =
  | { type: menuActions.setActive; payload: Menu }
  | { type: menuActions.setEditing; payload: Menu }
  | { type: menuActions.editNameAndClose; payload: Menu }
  | { type: menuActions.addLocalMenu; payload: Menu }
  | { type: menuActions.getAll; payload: Menu[] }
  | { type: menuActions.delete; payload: string };

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
    case menuActions.getAll:
      return action.payload.map((menu, i) =>
        i === 0
          ? { ...menu, isActive: true, isEditing: false }
          : { ...menu, isActive: false, isEditing: false }
      );
    case menuActions.delete:
      const foundMenu = state.find(menu => menu.id === action.payload);
      if (foundMenu?.isActive) {
        return state
          .filter(menu => menu.id !== action.payload)
          .map((menu, i) => (i === 0 ? { ...menu, isActive: true } : menu));
      }
      return state.filter(menu => menu.id !== action.payload);
    default:
      return state;
  }
}

interface MenuContextProviderProps {
  children: JSX.Element;
}

export function MenuContextProvider({ children }: MenuContextProviderProps) {
  const [state, dispatch] = useReducer(menusReducer, []);

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

  const { loading, errors, resetErrors } = useGetMenus(dispatch);

  return (
    <MenuContext.Provider
      value={{
        menus: {
          data: state,
          dispatchMenus: dispatch,
          menuActions,
          getActive,
          loading,
          errors,
          resetErrors,
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
