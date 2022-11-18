import { useEffect } from 'react';

export function useDebounce<T>(
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
