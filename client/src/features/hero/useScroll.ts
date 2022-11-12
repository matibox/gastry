import { RefObject, useCallback } from 'react';

export function useScroll(ref: RefObject<HTMLElement>) {
  const scrollTo = useCallback(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return { scrollTo };
}
