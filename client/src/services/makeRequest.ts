import { api } from '../api/api';

interface MakeRequestConfig {
  method: string;
  params?: object;
  data?: object;
}

export function makeRequest(url: string, config: MakeRequestConfig) {
  return api(url, config)
    .then(res => res.data)
    .catch(err => Promise.reject(err.message ?? 'Error'));
}
