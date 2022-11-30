import { makeRequest } from './makeRequest';

export function signup(
  email: string,
  username: string,
  password: string,
  confirmPassword: string
) {
  return makeRequest('/auth/register', {
    method: 'POST',
    data: {
      email,
      name: username,
      password,
      confirmPassword,
    },
  });
}
