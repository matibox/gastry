import express from 'express';
import validateSchema from '../middleware/validateSchema';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import { createUser, findByEmail } from '../services/user.services';
import bcrypt from 'bcrypt';

export const authRouter = express.Router();

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
      return res.status(201);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

authRouter.post('/login', validateSchema(loginUserSchema), async (req, res) => {
  const wrongEmailOrPassword = () => {
    return res.status(404).json([{ message: 'Wrong email/password' }]);
  };

  try {
    const user = await findByEmail(req.body.email);
    if (!user) {
      return wrongEmailOrPassword();
    }

    const isPasswordMatching = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatching) {
      return wrongEmailOrPassword();
    }

    //! temporary
    res.sendStatus(200);
    // jwt
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});
