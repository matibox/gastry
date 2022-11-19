import { makeRequest } from './makeRequest';

export function getLatestRecipes(offset: number, quantity: number) {
  return makeRequest('/recipes/latest', {
    method: 'POST',
    params: {
      skip: offset,
      take: quantity,
    },
  });
}

export function getYourRecipes(offset: number, quantity: number) {
  //! implement after auth, currently /latestRecipes is used
  //! as a placeholder
  return makeRequest('/recipes/latest', {
    method: 'POST',
    params: {
      skip: offset,
      take: quantity,
    },
  });
}

export function getByQuery(offset: number, quantity: number, query: string) {
  return makeRequest('/recipes/search', {
    method: 'POST',
    params: {
      q: query,
      skip: offset,
      take: quantity,
    },
  });
}
