import { useCallback, useState } from 'react';
import { TError } from '../types/Error';

interface ServiceFn {
  data: undefined;
  loading: boolean;
  errors: undefined | TError[];
  run: (...params: any[]) => Promise<any>;
}

export function useLoadMore(quantity: number, serviceFn: ServiceFn) {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(true);

  const loadMore = useCallback((...params: any[]) => {
    if (!moreToLoad) return;
    serviceFn.run(offset, quantity, ...params).then(newData => {
      setData(prevData => {
        return [
          ...new Map(
            [...prevData, ...newData.recipes].map(item => [item.id, item])
          ).values(),
        ];
      });
      setMoreToLoad(newData.moreToLoad);
      setOffset(prevOffset => prevOffset + quantity);
    });
  }, []);

  return {
    data,
    loading: serviceFn.loading,
    errors: serviceFn.errors,
    moreToLoad,
    loadMore,
  };
}
