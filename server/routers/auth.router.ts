import express from 'express';
import { z } from 'zod';

export const authRouter = express.Router();

const userSchema = z.object({
  name: z.string().min(6),
  email: z.string().min(6).email(),
  password: z.string().min(6),
});

authRouter.post('/register', async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json(validation.error.format().name?._errors[0]);
  }
});
