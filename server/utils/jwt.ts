import jwt from 'jsonwebtoken';
import { accessTokenExpiry, refreshTokenExpiry } from '../config/jwtExpiry';

const getSecret = (isRefreshToken: boolean) => {
  return isRefreshToken
    ? (process.env.JWT_REFRESH_SECRET as string)
    : (process.env.JWT_SECRET as string);
};

const getExpiryTime = (isRefreshToken: boolean) => {
  return isRefreshToken ? refreshTokenExpiry : accessTokenExpiry;
};

export function signJWT(payload: object, isRefreshToken: boolean = false) {
  return jwt.sign(payload, getSecret(isRefreshToken), {
    expiresIn: getExpiryTime(isRefreshToken),
  });
}

export function verifyJWT(token: string, isRefreshToken: boolean = false) {
  try {
    const decoded = jwt.verify(token, getSecret(isRefreshToken));
    return { payload: decoded, expired: false };
  } catch (err: any) {
    return { payload: null, expired: err.message.includes('jwt expired') };
  }
}
