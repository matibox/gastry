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

interface LatestRecipes {
  Body: {
    skip: number;
    take: number;
  };
}

app.post<LatestRecipes>('/latestRecipes', async req => {
  const { skip, take } = req.body;
  //TODO recipe thumbnails

  if (skip === undefined || take === undefined) {
    return app.httpErrors.badRequest('skip/take is undefined');
  }

  return await commitToDb(
    prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        cookingTime: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take,
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
