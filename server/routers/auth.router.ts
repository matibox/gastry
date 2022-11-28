import express from 'express';
import { registerUserSchema } from '../schemas/user.schema';

export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {});
