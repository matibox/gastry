import { AxiosRequestConfig } from 'axios';
import { api } from '../api/api';

export function makeRequest(url: string, config: AxiosRequestConfig<object>) {
  return api(url, config)
    .then(res => res.data)
    .catch(err => Promise.reject(err.response.data ?? 'Error'));
}
