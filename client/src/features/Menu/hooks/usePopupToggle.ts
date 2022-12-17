import { Dispatch, SetStateAction, useEffect } from 'react';

interface State {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}

export function usePopupToggle(states: [State, State]) {
  const { state: one, setState: setOne } = states[0];
  const { state: two, setState: setTwo } = states[1];

  useEffect(() => {
    if (one) setTwo(false);
  }, [one]);

  useEffect(() => {
    if (two) setOne(false);
  }, [two]);
}
