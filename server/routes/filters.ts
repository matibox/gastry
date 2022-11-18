import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import commitToDb from '../utils/commitToDb';
import prisma from '../utils/prisma';

export default function recipesRoutes(
  app: FastifyInstance,
  options: object,
  done: HookHandlerDoneFunction
) {
  app.get('/filters', async (req, res) => {
    return await commitToDb(
      prisma.recipeType.findMany({
        distinct: ['name'],
        select: { name: true },
      })
    );
  });

  done();
}
