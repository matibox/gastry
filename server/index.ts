import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

if (!process.env.PORT) process.exit(1);
const PORT = parseInt(process.env.PORT);

const app = Fastify();
app.register(sensible);

const prisma = new PrismaClient();

//TODO api routes

async function commitToDb(promise: Promise<unknown>) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen({ port: PORT }, () => {
  console.log(`App listening on port ${PORT}`);
});
