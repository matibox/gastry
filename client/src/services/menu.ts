import { makeAuthRequest } from './makeRequest';

export function addMenu(name: string) {
  return makeAuthRequest('/menu/', {
    method: 'POST',
    data: {
      name,
    },
  });
}
