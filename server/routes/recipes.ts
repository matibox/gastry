import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import prisma from '../utils/prisma';
import commitToDb from '../utils/commitToDb';

interface LatestRecipes {
  Body: {
    skip: number;
    take: number;
  };
}

export default function recipesRoutes(
  app: FastifyInstance,
  options: object,
  done: HookHandlerDoneFunction
) {
  app.post<LatestRecipes>('/latestRecipes', async (req, res) => {
    const { skip, take } = req.body;

    if (skip === undefined || take === undefined) {
      return app.httpErrors.badRequest('skip/take is undefined');
    }

    return await commitToDb(
      prisma.recipe.findMany({
        select: {
          id: true,
          title: true,
          cookingTime: true,
          thumbnail: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take,
      })
    );
  });

  done();
}
