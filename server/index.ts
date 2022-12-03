import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';

import { recipeRouter } from './routers/recipes.router';
import { filtersRouter } from './routers/filters.router';
import { authRouter } from './routers/user.router';

dotenv.config();

if (!process.env.PORT) process.exit(1);
const PORT = parseInt(process.env.PORT);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);
app.use(cookies());
app.use(express.json());
app.use('/recipes', recipeRouter);
app.use('/filters', filtersRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
