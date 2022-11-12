import { api } from '../api/api';

interface makeRequestConfig {
  method: string;
  params?: object;
  body?: object;
}

export function makeRequest(url: string, config: makeRequestConfig) {
  return api(url, config)
    .then(res => res.data)
    .catch(err => Promise.reject(err.message ?? 'Error'));
}
