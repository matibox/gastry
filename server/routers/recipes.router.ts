import express from 'express';
import {
  latestRecipes,
  singleRecipe,
  searchRecipes,
  addRecipe,
  addRecipeThumbnail,
} from '../services/recipes.services';
import { Prisma, RecipeTypeName } from '@prisma/client';
import validateSchema from '../middleware/validateSchema';
import authToken from '../middleware/authenticateToken';
import { createRecipeSchema } from '../schemas/recipe.schema';
import parser from '../utils/multer';

export const recipeRouter = express.Router();

// GET: latest recipes
recipeRouter.get('/latest', async (req, res) => {
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);

  if (isNaN(skip) || isNaN(take)) {
    return res.status(400).json([{ message: 'skip/take is undefined' }]);
  }

  try {
    const recipes = await latestRecipes(skip, take);
    return res.status(200).json(recipes);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: recipe search
recipeRouter.get('/search', async (req, res) => {
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
    return res.status(400).json([{ message: 'skip/take is undefined' }]);
  }

  if (recipeWhereFields.length === 0) {
    return res.status(404).json([{ message: 'No recipes found' }]);
  }

  try {
    const recipes = await searchRecipes(skip, take, recipeWhereFields);
    const nextRecipes = await searchRecipes(
      skip + take,
      take,
      recipeWhereFields
    );

    if (recipes.length === 0) {
      return res.status(404).json([{ message: 'No recipes found' }]);
    }

    return res.status(200).json({
      recipes,
      moreToLoad: nextRecipes.length > 0,
    });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: single recipe
recipeRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);

  try {
    const recipe = await singleRecipe(id);
    if (!recipe) {
      return res.status(404).json([{ message: 'Recipe not found' }]);
    }

    return res.status(200).json(recipe);
    //TODO isLiked, isAuthor etc.
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// POST: add recipe
recipeRouter.post(
  '/',
  validateSchema(createRecipeSchema),
  authToken,
  async (req, res) => {
    const { title, cookingTime, ingredients, instructions } = req.body;

    try {
      //@ts-ignore
      const user = req.user;
      const createdRecipe = await addRecipe(
        user.email,
        title,
        cookingTime,
        ingredients,
        instructions
      );

      return res.status(200).json(createdRecipe);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// PATCH: update recipe thumbnail
recipeRouter.patch(
  '/:id/thumbnail',
  parser.single('thumbnail'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json([{ message: 'Thumbnail not found' }]);
    }

    const imgURL = req.file.path;
    const recipeId = req.params.id;

    if (!recipeId) {
      return res.status(400).json([{ message: 'Please pass recipe id' }]);
    }

    try {
      const foundRecipe = await singleRecipe(recipeId);
      if (!foundRecipe) {
        return res
          .status(404)
          .json([{ message: 'No recipes found with following id' }]);
      }

      const updatedRecipe = await addRecipeThumbnail(recipeId, imgURL);

      return res.json(updatedRecipe);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);
