import { makeAuthRequest } from './makeRequest';

export function getMenus() {
  return makeAuthRequest('/menu/', {
    method: 'GET',
  });
}

export function addMenu(name: string) {
  return makeAuthRequest('/menu/', {
    method: 'POST',
    data: {
      name,
    },
  });
}

export function editMenu(id: string, name: string) {
  return makeAuthRequest(`/menu/${id}`, {
    method: 'PATCH',
    data: {
      name,
    },
  });
}
