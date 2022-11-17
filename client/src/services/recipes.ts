import { makeRequest } from './makeRequest';

export function getLatestRecipes(skip: number, take: number) {
  return makeRequest('/recipes/latest', {
    method: 'POST',
    data: {
      skip,
      take,
    },
  });
}

export function getYourRecipes(skip: number, take: number) {
  //! implement after auth, currently /latestRecipes is used
  //! as a placeholder
  return makeRequest('/recipes/latest', {
    method: 'POST',
    data: {
      skip,
      take,
    },
  });
}
