import { AxiosRequestConfig } from 'axios';
import { api } from '../api/api';
import jwtDecode from 'jwt-decode';
import { refreshToken } from './user';

export function makeRequest(url: string, config: AxiosRequestConfig<object>) {
  return api(url, config)
    .then(res => res.data)
    .catch(err => Promise.reject(err.response.data ?? 'Error'));
}

export async function makeAuthRequest(
  url: string,
  config: AxiosRequestConfig<object>
) {
  const user = localStorage.getItem('user');
  if (!user) {
    return Promise.reject([
      { message: 'Please log in to access this feature' },
    ]);
  }
  let token = JSON.parse(user).accessToken;
  const decodedToken = jwtDecode(token);

  if (new Date().getTime() >= (decodedToken as any).exp * 1000) {
    console.log('token expired, requesting new token');
    try {
      const user = await refreshToken();
      token = user.accessToken;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  return makeRequest(url, {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
