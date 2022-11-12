import { useCallback, useEffect, useState } from 'react';

type callback = (...cbParams: any[]) => Promise<any>;

export function useAsync(callback: callback, dependencies: any[] = []) {
  const { run, ...state } = useAsyncInternal(callback, dependencies, true);

  useEffect(() => {
    run();
  }, [run]);

  return state;
}

export function useAsyncFn(callback: callback, dependencies: any[] = []) {
  return useAsyncInternal(callback, dependencies);
}

function useAsyncInternal(
  callback: callback,
  dependencies: any[],
  initialLoading: boolean = false
) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(undefined);

  const run = useCallback((...params: any[]) => {
    setLoading(true);
    return callback(...params)
      .then(data => {
        setData(data);
        setError(undefined);
        return data;
      })
      .catch(err => {
        setData(undefined);
        setError(err);
        return Promise.reject(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);

  return { data, loading, error, run };
}
