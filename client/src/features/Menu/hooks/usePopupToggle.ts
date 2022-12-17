import { Dispatch, SetStateAction, useEffect } from 'react';

interface State {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}

export function usePopupToggle(states: [State, State, State]) {
  const { state: one, setState: setOne } = states[0];
  const { state: two, setState: setTwo } = states[1];
  const { state: three, setState: setThree } = states[2];

  useEffect(() => {
    if (one) {
      setTwo(false);
      setThree(false);
    }
  }, [one]);

  useEffect(() => {
    if (two) {
      setOne(false);
      setThree(false);
    }
  }, [two]);

  useEffect(() => {
    if (three) {
      setOne(false);
      setTwo(false);
    }
  }, [three]);
}
