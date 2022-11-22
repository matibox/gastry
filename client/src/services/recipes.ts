import { Filters } from '../types/Filters';
import { makeRequest } from './makeRequest';

export function getLatestRecipes(offset: number, quantity: number) {
  return makeRequest('/recipes/latest', {
    method: 'GET',
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
    method: 'GET',
    params: {
      skip: offset,
      take: quantity,
    },
  });
}

export function getByQuery(
  offset: number,
  quantity: number,
  query: string,
  filters?: Filters[]
) {
  return makeRequest('/recipes/search', {
    method: 'GET',
    params: {
      q: query,
      skip: offset,
      take: quantity,
      filters: filters?.join(',') || undefined,
    },
  });
}

export function getRecipe(id: string) {
  return makeRequest(`/recipes/${id}`, {
    method: 'GET',
  });
}
