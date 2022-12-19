import { useCallback, useEffect, useState } from 'react';
import { dislikeRecipe, getIsLiked, likeRecipe } from '../services/recipes';
import { User } from '../types/User';
import { useAsyncFn } from './useAsync';

export function useLike(user: User | undefined, recipeId: string) {
  const [isFav, setIsFav] = useState(false);

  const getFavFn = useAsyncFn(getIsLiked);
  const likeFn = useAsyncFn(likeRecipe);
  const dislikeFn = useAsyncFn(dislikeRecipe);

  useEffect(() => {
    if (!user) return;
    getFavFn.run(recipeId).then(setIsFav);
  }, [user]);

  const toggleLike = useCallback(() => {
    if (!isFav) {
      likeFn.run(recipeId).then(setIsFav);
    } else {
      dislikeFn.run(recipeId).then(setIsFav);
    }
  }, [isFav]);

  return {
    isFav,
    toggleLike,
    loading: getFavFn.loading || likeFn.loading || dislikeFn.loading,
    errors: getFavFn.errors?.concat(
      likeFn.errors?.concat(dislikeFn.errors ?? []) || []
    ),
  };
}
