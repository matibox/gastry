import express from 'express';
import type { Request, Response } from 'express';
import {
  latestRecipes,
  singleRecipe,
  searchRecipes,
} from '../services/recipes.services';
import { Prisma, RecipeTypeName } from '@prisma/client';

export const recipeRouter = express.Router();

// GET: latest recipes
recipeRouter.get('/latest', async (req: Request, res: Response) => {
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);

  if (isNaN(skip) || isNaN(take)) {
    return res.status(400).json('skip/take is undefined');
  }

  try {
    const recipes = await latestRecipes(skip, take);
    return res.status(200).json(recipes);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});

// GET: recipe search
recipeRouter.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const filters = req.query.filters as string;
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);

  const filtersArray = filters?.split(',') as Prisma.Enumerable<RecipeTypeName>;

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

  if (isNaN(skip) || isNaN(take)) {
    return res.status(400).json('skip/take is undefined');
  }

  if (recipeWhereFields.length === 0) {
    return res.status(204).json({
      recipes: [],
      moreToLoad: false,
    });
  }

  try {
    const recipes = await searchRecipes(skip, take, recipeWhereFields);
    const nextRecipes = await searchRecipes(
      skip + take,
      take,
      recipeWhereFields
    );

    return res.status(200).json({
      recipes,
      moreToLoad: nextRecipes.length > 0,
      notFound: recipes.length === 0,
    });
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});

// GET: single recipe
recipeRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json('No id specified');

  try {
    const recipe = await singleRecipe(id);
    if (!recipe) {
      return res.status(404).json('Recipe not found');
    }

    return res.status(200).json(recipe);
    //TODO isLiked, isAuthor etc.
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});
