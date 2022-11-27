import express from 'express';
import { getUserByEmail } from '../services/auth.services';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

interface User {
  email: string;
  password: string;
  id: string;
  name: string;
  role: 'admin' | 'user';
}

function generateAccessToken(user: User) {
  return jwt.sign(
    { id: user.id, isAdmin: user.role === 'admin' },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '5s',
    }
  );
}

function generateRefreshToken(user: User) {
  return jwt.sign(
    { id: user.id, isAdmin: user.role === 'admin' },
    process.env.JWT_REFRESH_SECRET as string
  );
}

authRouter.post('/login', async (req, res) => {
  //TODO password encryption
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('email/password is undefined');
  }

  try {
    const user = await getUserByEmail(email);
    if (!user || password !== user?.password) {
      return res.status(403).json('Wrong email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
      email: user.email,
      username: user.name,
      isAdmin: user.role === 'admin',
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});
