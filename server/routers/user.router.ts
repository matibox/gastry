import express, { Request } from 'express';
import validateSchema from '../middleware/validateSchema';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import { createUser, findByEmail } from '../services/user.services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createSession,
  getSession,
  invalidateSession,
} from '../services/session.services';
import { accessTokenExpiry, refreshTokenExpiry } from '../config/jwtExpiry';
import { signJWT, verifyJWT } from '../utils/jwt';
import deserializeUser from '../middleware/deserializeUser';

export const authRouter = express.Router();

export interface AccessTokenPayload {
  user: {
    email: string;
  };
  sessionId: string;
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

    const session = await createSession(user.id);

    const accessToken = jwt.sign(
      {
        email: user.email,
        sessionId: session.id,
        isAdmin: user.role === 'admin',
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: accessTokenExpiry,
      }
    );

    const refreshToken = jwt.sign(
      {
        sessionId: session.id,
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: refreshTokenExpiry,
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800000, // 2 weeks
      secure: true,
    });

    res.status(200).json({ email: user.email, name: user.name, accessToken });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: refresh the token
authRouter.get('/token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json([{ message: 'Session expired' }]);
  }

  const { payload } = verifyJWT(refreshToken, true);
  let session;

  try {
    session = await getSession((payload as AccessTokenPayload).sessionId);

    if (!session) {
      return res.status(403).json([{ message: 'Invalid session' }]);
    }
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }

  const newAccessToken = signJWT(session);

  return res.status(200).json({
    accessToken: newAccessToken,
  });
});

// POST: logout user
authRouter.post('/logout', deserializeUser, async (req, res) => {
  res.cookie('refreshToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  try {
    //@ts-ignore
    const session = await invalidateSession(req.user.sessionId);
    return res.json(session);
  } catch (err: any) {
    return res.json([{ message: err.message }]);
  }
});
