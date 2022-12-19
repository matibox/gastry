import { makeAuthRequest, makeRequest } from './makeRequest';

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

export function login(email: string, password: string) {
  return makeRequest('/auth/login', {
    method: 'POST',
    data: {
      email,
      password,
    },
  });
}

export function refreshToken() {
  return makeRequest('/auth/token', {
    method: 'POST',
  });
}

export function logout() {
  return makeRequest('/auth/logout', {
    method: 'POSt',
  });
}

export function updateProfilePicture(formData: FormData) {
  return makeAuthRequest('/auth/picture', {
    method: 'PATCH',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
