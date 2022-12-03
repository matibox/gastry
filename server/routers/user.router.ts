import express from 'express';
import validateSchema from '../middleware/validateSchema';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import {
  addRefreshToken,
  createUser,
  findByEmail,
  getRefreshToken,
  removeRefreshToken,
} from '../services/user.services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { accessTokenExpiry, refreshTokenExpiry } from '../config/jwtExpiry';

export const authRouter = express.Router();

interface TokenPayload {
  email: string;
  isAdmin: boolean;
}

// POST: register user
authRouter.post(
  '/register',
  validateSchema(registerUserSchema),
  async (req, res) => {
    // Check if email already exists
    const emailExists = await findByEmail(req.body.email);
    if (emailExists) {
      return res.status(409).json([{ message: 'Email already exists' }]);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await createUser({
        body: { ...req.body, password: hashedPassword },
      });
      return res.sendStatus(201);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// POST: login user
authRouter.post('/login', validateSchema(loginUserSchema), async (req, res) => {
  try {
    const user = await findByEmail(req.body.email);
    if (!user) {
      return res.status(404).json([{ message: 'User not found' }]);
    }

    const isPasswordMatching = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatching) {
      return res.status(403).json([{ message: 'Wrong email/password' }]);
    }

    const { accessToken, refreshToken } = generateTokens({
      email: user.email,
      isAdmin: user.role === 'admin',
    });

    await addRefreshToken(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800000, // 2 weeks
      secure: true,
      sameSite: 'none',
    });

    res
      .status(200)
      .json({
        email: user.email,
        name: user.name,
        isAdmin: user.role === 'admin',
        accessToken,
      });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// POST: refresh the token
authRouter.post('/token', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json([{ message: 'Session expired' }]);
  }

  try {
    const foundToken = await getRefreshToken(refreshToken);
    if (!foundToken) {
      return res.status(403).json([{ message: 'Token not found' }]);
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      (err: any, user: any) => {
        if (err) return res.status(403).json([{ message: 'Wrong token' }]);
        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken });
      }
    );
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// POST: logout user
authRouter.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    if (refreshToken) {
      await removeRefreshToken(refreshToken);
    }

    res.cookie('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: accessTokenExpiry,
  });
}

function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: refreshTokenExpiry,
  });
}

function generateTokens(payload: TokenPayload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
