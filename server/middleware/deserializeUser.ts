import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/jwt';

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json([
      {
        message: 'Token not found',
      },
    ]);
  }

  const { payload } = verifyJWT(token);

  if (!payload) {
    return res.status(403).json([{ message: 'Invalid token' }]);
  }

  //@ts-ignore
  req.user = payload;
  next();
}
