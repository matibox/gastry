import { useCallback, useState } from 'react';

interface ServiceFn {
  data: undefined;
  loading: boolean;
  error: undefined;
  run: (...params: any[]) => Promise<any>;
}

export function useLoadMore(quantity: number, serviceFn: ServiceFn) {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [moreToLoad, setMoreToLoad] = useState(true);

  const loadMore = useCallback((...params: any[]) => {
    if (!moreToLoad) return;
    serviceFn.run(offset, quantity, ...params).then(newData => {
      let length = data.length;
      setData(prevData => {
        return [
          ...new Map(
            [...prevData, ...newData].map(item => [item.id, item])
          ).values(),
        ];
      });
      if (data.length === length) {
        setMoreToLoad(false);
        return;
      }
      setOffset(prevOffset => prevOffset + quantity);
    });
  }, []);

  return {
    data,
    loading: serviceFn.loading,
    error: serviceFn.error,
    moreToLoad,
    loadMore,
  };
}
