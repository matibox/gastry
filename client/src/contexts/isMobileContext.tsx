import { createContext, useContext, useEffect, useState } from 'react';

const IsMobileContext = createContext({ isMobile: window.innerWidth < 768 });

interface IsMobileContextProviderProps {
  children: JSX.Element;
}

export function useIsMobile() {
  return useContext(IsMobileContext);
}

export function IsMobileContextProvider({
  children,
}: IsMobileContextProviderProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const onResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <IsMobileContext.Provider value={{ isMobile }}>
      {children}
    </IsMobileContext.Provider>
  );
}
