import { useEffect, useState } from 'react';
import { Day } from '../../../types/Menu';

export function useDaySwiper(days: Day[]) {
  const [x, setX] = useState('');

  useEffect(() => {
    const currentIndex = days.findIndex(day => day.isActive);
    if (currentIndex === -1) return;
    console.log(currentIndex);
    setX(`${100 - currentIndex * 35}%`);
  }, [days]);

  return x;
}
