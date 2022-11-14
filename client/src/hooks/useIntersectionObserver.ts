import { MutableRefObject, useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
  ref: MutableRefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {},
  forward: boolean = true
) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<null | IntersectionObserver>(null);

  function cleanOb() {
    if (observer.current) {
      observer.current.disconnect();
    }
  }

  useEffect(() => {
    setElement(ref.current);
  }, []);

  useEffect(() => {
    if (!element) return;
    cleanOb();
    const ob = (observer.current = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting;
      if (!forward) {
        setIsIntersecting(isElementIntersecting);
      } else if (forward && !isIntersecting && isElementIntersecting) {
        setIsIntersecting(isElementIntersecting);
        cleanOb();
      }
    }, options));
    ob.observe(element);

    return () => {
      cleanOb();
    };
  }, [element]);

  return { isIntersecting };
}
