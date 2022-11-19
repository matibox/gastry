import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import prisma from '../utils/prisma';
import commitToDb from '../utils/commitToDb';
import { Prisma, RecipeTypeName } from '@prisma/client';

interface Pagination {
  Body: {
    skip: number;
    take: number;
  };
}

interface RecipesSearch extends Pagination {
  Querystring: {
    q: string;
    filters: string;
    sortBy: string;
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
    types: true,
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
    const { q: query, filters, sortBy } = req.query;
    const { skip, take } = req.body;

    const [sortedItem, order] = sortBy?.split(':') || ['updatedAt', 'desc'];
    const filtersArray = filters?.split(
      ','
    ) as Prisma.Enumerable<RecipeTypeName>;

    let recipeWhereFields: {};

    if (!filtersArray) {
      console.log('only query');
      recipeWhereFields = {
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
    } else {
      recipeWhereFields = {
        AND: [
          {
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
          },
          {
            types: {
              some: {
                name: {
                  in: filtersArray,
                },
              },
            },
          },
        ],
      };
    }

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
        orderBy: {
          [sortedItem]: order,
        },
        skip,
        take,
      });

      const nextRecipes = await prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        where: recipeWhereFields,
        orderBy: {
          [sortedItem]: order,
        },
        skip: skip + take,
        take,
      });

      return {
        recipes,
        moreToLoad: nextRecipes.length > 0,
      };
    } catch (e) {
      return app.httpErrors.internalServerError();
    }
  });

  done();
}
