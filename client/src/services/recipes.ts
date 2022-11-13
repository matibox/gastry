import { makeRequest } from './makeRequest';

export function getLatestRecipes(skip: number, take: number) {
  return makeRequest('/latestRecipes', {
    method: 'POST',
    data: {
      skip,
      take,
    },
  });
}
