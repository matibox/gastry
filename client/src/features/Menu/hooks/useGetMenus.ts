import { useCallback, useEffect, useState } from 'react';
import { useAsync } from '../../../hooks/useAsync';
import { getMenus } from '../../../services/menu';
import { TError } from '../../../types/Error';
import { Action, menuActions } from '../contexts/MenuContext';

export function useGetMenus(dispatchMenus: React.Dispatch<Action>) {
  const { data, loading, errors } = useAsync(getMenus);

  const [resetableErrors, setResetableErrors] = useState<TError[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (data) {
      dispatchMenus({ type: menuActions.getAll, payload: data });
    }
  }, [data]);

  useEffect(() => {
    setResetableErrors(errors);
  }, [errors]);

  const resetErrors = useCallback(() => {
    setResetableErrors(undefined);
  }, [resetableErrors]);

  return { loading, errors: resetableErrors, resetErrors };
}
