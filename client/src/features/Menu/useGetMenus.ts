import { useEffect } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getMenus } from '../../services/menu';
import { Action, menuActions } from './MenuContext';

export function useGetMenus(dispatchMenus: React.Dispatch<Action>) {
  const { data, loading, errors } = useAsync(getMenus);

  useEffect(() => {
    if (data) {
      dispatchMenus({ type: menuActions.getAll, payload: data });
    }
  }, [data]);

  return { loading, errors };
}
