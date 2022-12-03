import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default function authToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json([{ message: 'Unauthenticated' }]);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json([{ message: 'Access forbidden' }]);
    //@ts-ignore
    req.user = user;
    next();
  });
}
