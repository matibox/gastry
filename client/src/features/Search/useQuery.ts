import { useEffect } from 'react';

export function useQuery<T>(
  callback: () => void,
  delay: number,
  dependencies: T[] = []
) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, ...dependencies]);
}
