import express from 'express';
import validateSchema from '../middleware/validateSchema';
import { registerUserSchema } from '../schemas/user.schema';
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
