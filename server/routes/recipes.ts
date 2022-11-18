import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import prisma from '../utils/prisma';
import commitToDb from '../utils/commitToDb';

interface Pagination {
  Body: {
    skip: number;
    take: number;
  };
}

interface RecipesSearch extends Pagination {
  Querystring: {
    q: string;
  };
}

export default function recipesRoutes(
  app: FastifyInstance,
  options: object,
  done: HookHandlerDoneFunction
) {
  const recipeOverviewSelectFields = {
    id: true,
    title: true,
    cookingTime: true,
    thumbnail: true,
  };

  app.post<Pagination>('/recipes/latest', async (req, res) => {
    const { skip, take } = req.body;

    if (skip === undefined || take === undefined) {
      return app.httpErrors.badRequest('skip/take is undefined');
    }

    return await commitToDb(
      prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take,
      })
    );
  });

  app.post<RecipesSearch>('/recipes/search', async (req, res) => {
    const query = req.query.q;
    const { skip, take } = req.body;
    let moreToLoad: boolean;

    const recipeWhereFields = {
      OR: [
        {
          title: { contains: query },
        },
        {
          ingredients: {
            some: {
              name: {
                contains: query,
              },
            },
          },
        },
      ],
    };

    if (skip === undefined || take === undefined) {
      return app.httpErrors.badRequest('skip/take is undefined');
    }

    if (!query) {
      return app.httpErrors.badRequest('query was not provided');
    }

    try {
      const recipes = await prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        where: recipeWhereFields,
        skip,
        take,
      });

      const nextRecipes = await prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        where: recipeWhereFields,
        skip: skip + take,
        take,
      });

      if (nextRecipes.length > 0) {
        moreToLoad = true;
      } else {
        moreToLoad = false;
      }

      return {
        recipes,
        moreToLoad,
      };
    } catch (e) {
      return app.httpErrors.internalServerError();
    }
  });

  done();
}
