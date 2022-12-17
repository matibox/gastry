import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useGetMenus } from '../hooks/useGetMenus';
import { Day, Menu } from '../../../types/Menu';
import { usePopupToggle } from '../hooks/usePopupToggle';
import { TError } from '../../../types/Error';
import { getWeekday } from '../utils/getWeekday';

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
  days: {
    getActive: () => Day | null;
    getActiveIndex: () => number;
  };
  timeOfDays: {
    currentId: string | null;
    setCurrentId: React.Dispatch<React.SetStateAction<null | string>>;
  };
  menuPicker: {
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  };
  newMenuForm: {
    isOpened: boolean;
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  };
  recipePick: {
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
  setDayActive = 'SET_DAY_ACTIVE',
  setRecipe = 'SET_RECIPE',
  removeRecipe = 'REMOVE_RECIPE',
}

export type Action =
  | { type: menuActions.setActive; payload: Menu }
  | { type: menuActions.setEditing; payload: Menu }
  | { type: menuActions.editNameAndClose; payload: Menu }
  | { type: menuActions.addLocalMenu; payload: Menu }
  | { type: menuActions.getAll; payload: Menu[] }
  | { type: menuActions.delete; payload: string }
  | { type: menuActions.setDayActive; payload: string }
  | {
      type: menuActions.setRecipe;
      payload: { timeOfDayId: string; id: string; title: string };
    }
  | {
      type: menuActions.removeRecipe;
      payload: string;
    };

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
          ? {
              ...menu,
              isActive: true,
              isEditing: false,
              days: menu.days.map(day =>
                day.name === getWeekday().toLowerCase()
                  ? { ...day, isActive: true }
                  : { ...day, isActive: false }
              ),
            }
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
    case menuActions.setDayActive:
      return state.map(menu => ({
        ...menu,
        days: menu.days.map(day =>
          day.id === action.payload
            ? { ...day, isActive: true }
            : { ...day, isActive: false }
        ),
      }));
    case menuActions.setRecipe:
      return state.map(menu => {
        return {
          ...menu,
          days: menu.days.map(day => {
            return {
              ...day,
              timeOfDays: day.timeOfDays.map(time =>
                time.id === action.payload.timeOfDayId
                  ? {
                      ...time,
                      recipe: {
                        id: action.payload.id,
                        title: action.payload.title,
                      },
                    }
                  : time
              ),
            };
          }),
        };
      });
    case menuActions.removeRecipe:
      return state.map(menu => {
        return {
          ...menu,
          days: menu.days.map(day => {
            return {
              ...day,
              timeOfDays: day.timeOfDays.map(time => {
                if (time.id === action.payload) {
                  return { ...time, recipe: undefined };
                }
                return time;
              }),
            };
          }),
        };
      });
    default:
      return state;
  }
}

interface MenuContextProviderProps {
  children: JSX.Element;
}

export function MenuContextProvider({ children }: MenuContextProviderProps) {
  const [state, dispatch] = useReducer(menusReducer, []);

  const [currentTimeOfDayId, setCurrentTimeOfDayId] = useState<null | string>(
    null
  );

  const [isMenuPickerOpened, setIsMenuPickerOpened] = useState(false);
  const [isNewMenuFormOpened, setIsNewMenuFormOpened] = useState(false);
  const [isRecipePickOpened, setIsRecipePickOpened] = useState(false);

  usePopupToggle([
    {
      state: isMenuPickerOpened,
      setState: setIsMenuPickerOpened,
    },
    {
      state: isNewMenuFormOpened,
      setState: setIsNewMenuFormOpened,
    },
    {
      state: isRecipePickOpened,
      setState: setIsRecipePickOpened,
    },
  ]);

  const getActiveMenu = useCallback(() => {
    const foundActive = state.find(menu => menu.isActive);
    if (!foundActive) return null;
    return foundActive;
  }, [state]);

  const getActiveDay = useCallback(() => {
    const foundActive = state.map(menu => {
      return menu.days.find(day => day.isActive);
    })[0];
    if (!foundActive) return null;
    return foundActive;
  }, [state]);

  const getActiveDayIndex = useCallback(() => {
    return state.map(menu => {
      return menu.days.findIndex(day => day.isActive);
    })[0];
  }, [state]);

  const { loading, errors, resetErrors } = useGetMenus(dispatch);

  return (
    <MenuContext.Provider
      value={{
        menus: {
          data: state,
          dispatchMenus: dispatch,
          menuActions,
          getActive: getActiveMenu,
          loading,
          errors,
          resetErrors,
        },
        days: {
          getActive: getActiveDay,
          getActiveIndex: getActiveDayIndex,
        },
        timeOfDays: {
          currentId: currentTimeOfDayId,
          setCurrentId: setCurrentTimeOfDayId,
        },
        menuPicker: {
          isOpened: isMenuPickerOpened,
          setIsOpened: setIsMenuPickerOpened,
        },
        newMenuForm: {
          isOpened: isNewMenuFormOpened,
          setIsOpened: setIsNewMenuFormOpened,
        },
        recipePick: {
          isOpened: isRecipePickOpened,
          setIsOpened: setIsRecipePickOpened,
        },
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
