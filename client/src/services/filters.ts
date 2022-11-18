import { makeRequest } from './makeRequest';

export function getFilters() {
  return makeRequest('/filters', { method: 'GET' });
}
