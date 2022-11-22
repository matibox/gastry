import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import prisma from '../utils/prisma';
import commitToDb from '../utils/commitToDb';
import { Prisma, RecipeTypeName } from '@prisma/client';

interface LatestRecipes {
  Querystring: {
    skip: string;
    take: string;
  };
}

interface RecipesSearch {
  Querystring: {
    q: string;
    filters: string;
    skip: string;
    take: string;
  };
}

interface Recipe {
  Params: {
    id: string;
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
    updatedAt: true,
  };

  app.get<LatestRecipes>('/recipes/latest', async (req, res) => {
    const { skip, take } = req.query;

    if (skip === undefined || take === undefined) {
      return app.httpErrors.badRequest('skip/take is undefined');
    }

    return await commitToDb(
      prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        orderBy: {
          updatedAt: 'desc',
        },
        skip: parseInt(skip),
        take: parseInt(take),
      })
    );
  });

  app.get<RecipesSearch>('/recipes/search', async (req, res) => {
    const { q: query, filters, skip, take } = req.query;

    const filtersArray = filters?.split(
      ','
    ) as Prisma.Enumerable<RecipeTypeName>;

    let recipeWhereFields: {}[] = [];

    if (query) {
      recipeWhereFields.push({
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
      });
    }

    if (filtersArray) {
      recipeWhereFields.push({
        types: {
          some: {
            name: {
              in: filtersArray,
            },
          },
        },
      });
    }

    if (skip === undefined || take === undefined) {
      return app.httpErrors.badRequest('skip/take is undefined');
    }

    if (recipeWhereFields.length === 0) {
      return {
        recipes: [],
        moreToLoad: false,
      };
    }

    try {
      const recipes = await prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        where: {
          AND: recipeWhereFields,
        },
        skip: parseInt(skip),
        take: parseInt(take),
      });

      const nextRecipes = await prisma.recipe.findMany({
        select: recipeOverviewSelectFields,
        where: {
          AND: recipeWhereFields,
        },
        skip: parseInt(skip) + parseInt(take),
        take: parseInt(take),
      });

      return {
        recipes,
        moreToLoad: nextRecipes.length > 0,
        notFound: recipes.length === 0,
      };
    } catch (e) {
      return app.httpErrors.internalServerError();
    }
  });

  app.get<Recipe>('/recipes/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) return app.httpErrors.badRequest('No id specified');

    const recipe = await commitToDb(
      prisma.recipe.findUnique({
        where: {
          id,
        },
        select: {
          title: true,
          cookingTime: true,
          ingredients: {
            select: {
              name: true,
              quantity: true,
              unit: true,
            },
          },
          instructions: true,
          thumbnail: true,
        },
      })
    );

    return {
      ...(recipe as object),
      //TODO isLiked, isAuthor etc.
    };
  });

  done();
}
