import { Dispatch, SetStateAction, useEffect } from 'react';
import { useIsMobile } from '../../../contexts/isMobileContext';

interface State {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}

export function usePopupToggle(states: [State, State, State]) {
  const { isMobile } = useIsMobile();
  const { state: one, setState: setOne } = states[0];
  const { state: two, setState: setTwo } = states[1];
  const { state: three, setState: setThree } = states[2];

  useEffect(() => {
    if (!isMobile) return;
    if (one) {
      setTwo(false);
      setThree(false);
    }
  }, [one, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (two) {
      setOne(false);
      setThree(false);
    }
  }, [two, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    if (three) {
      setOne(false);
      setTwo(false);
    }
  }, [three, isMobile]);
}
