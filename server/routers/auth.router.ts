import express from 'express';
import type { Request, Response } from 'express';

export const authRouter = express.Router();

authRouter.post('/login', (req, res) => {});
