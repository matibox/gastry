import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

if (!process.env.PORT) process.exit(1);
const PORT = parseInt(process.env.PORT);

const app = Fastify();
app.register(sensible);
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});

const prisma = new PrismaClient();

app.get('/recipes', async () => {
  return await commitToDb(
    prisma.recipe.findMany({
      select: {
        id: true,
        cookingTime: true,
        title: true,
      },
    })
  );
});

async function commitToDb(promise: Promise<unknown>) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: PORT }, () => {
  console.log(`App listening on port ${PORT}`);
});
