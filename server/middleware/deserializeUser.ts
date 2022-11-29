import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getSession } from '../services/session.services';
import { signJWT, verifyJWT } from '../utils/jwt';
import { AccessTokenPayload } from '../routers/user.router';

interface CustomRequest extends Request {
  user: object;
}

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  if (payload) {
    (req as CustomRequest).user = payload as jwt.JwtPayload;
    return next();
  }

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken, true) : { payload: null };

  if (!refresh) {
    return next();
  }

  const session = await getSession((refresh as AccessTokenPayload).sessionId);

  if (!session) {
    return next();
  }

  const newAccessToken = signJWT(session);

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    maxAge: 300000, // 5m
  });

  (req as CustomRequest).user = verifyJWT(newAccessToken).payload as JwtPayload;

  return next();
}
