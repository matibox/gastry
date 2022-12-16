import { Filters } from '../types/Filters';
import { Ingredient } from '../types/Ingredient';
import { makeAuthRequest, makeRequest } from './makeRequest';

export function getLatestRecipes(offset: number, quantity: number) {
  return makeRequest('/recipes/latest', {
    method: 'GET',
    params: {
      skip: offset,
      take: quantity,
    },
  });
}

export function getYourRecipes(
  offset: number,
  quantity: number,
  query: string,
  filters?: Filters[]
) {
  return makeAuthRequest('/recipes/your', {
    method: 'GET',
    params: {
      q: query,
      skip: offset,
      take: quantity,
      filters: filters?.join(',') || undefined,
    },
  });
}

export function getYourLatestRecipes() {
  return makeAuthRequest('/recipes/your/latest', {
    method: 'GET',
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

export function getRecipeWithAuthor(id: string) {
  return makeAuthRequest(`/recipes/${id}/isAuthor`, {
    method: 'GET',
  });
}

export function createRecipe(
  title: string,
  cookingTime: number,
  ingredients: Ingredient[],
  instructions: string,
  types: string[]
) {
  return makeAuthRequest('/recipes', {
    method: 'POST',
    data: {
      title,
      cookingTime,
      ingredients,
      instructions,
      types,
    },
  });
}

export function updateRecipeThumbnail(recipeId: string, formData: FormData) {
  return makeAuthRequest(`/recipes/${recipeId}/thumbnail`, {
    method: 'PATCH',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function editRecipe(
  recipeId: string,
  title: string,
  cookingTime: number,
  ingredients: Ingredient[],
  instructions: string,
  types: { id: string; name: string }[]
) {
  return makeAuthRequest(`/recipes/${recipeId}`, {
    method: 'PUT',
    data: {
      title,
      cookingTime,
      ingredients,
      instructions,
      types,
    },
  });
}

export function deleteRecipe(id: string) {
  return makeAuthRequest(`/recipes/${id}`, {
    method: 'DELETE',
  });
}
