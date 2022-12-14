import express, { Request } from 'express';
import {
  getLatestRecipes,
  getRecipe,
  searchRecipes,
  addRecipe,
  editRecipeThumbnail,
  getYourRecipes,
  updateRecipe,
  deleteRecipe,
  getYourLatestRecipes,
  getRecipesToPick,
  getIsFavourite,
  likeRecipe,
  dislikeRecipe,
  getLikedRecipes,
} from '../services/recipes.services';
import { Prisma, RecipeTypeName } from '@prisma/client';
import validateSchema from '../middleware/validateSchema';
import authToken from '../middleware/authenticateToken';
import { createRecipeSchema } from '../schemas/recipe.schema';
import parser from '../utils/multer';
import { findByEmail } from '../services/user.services';

export const recipeRouter = express.Router();

// GET: latest recipes
recipeRouter.get('/latest', async (req, res) => {
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);

  if (isNaN(skip) || isNaN(take)) {
    return res.status(400).json([{ message: 'skip/take is undefined' }]);
  }

  try {
    const recipes = await getLatestRecipes(skip, take);
    return res.status(200).json({ recipes, moreToLoad: false });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: recipe search
recipeRouter.get('/search', async (req, res) => {
  const { skip, take, recipeWhereFields, error } = recipeSearchHandler(req);

  if (error) return res.status(error.code).json([{ message: error.message }]);

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

// GET: your recipes
recipeRouter.get('/your', authToken, async (req, res) => {
  const { skip, take, recipeWhereFields, error } = recipeSearchHandler(
    req,
    false
  );

  if (error) return res.status(error.code).json([{ message: error.message }]);

  //@ts-ignore
  const user = req.user;

  try {
    const recipes = await getYourRecipes(
      user.email,
      skip,
      take,
      recipeWhereFields
    );
    const nextRecipes = await getYourRecipes(
      user.email,
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

// GET: liked recipes
recipeRouter.get('/liked', authToken, async (req, res) => {
  const { skip, take, recipeWhereFields, error } = recipeSearchHandler(
    req,
    false
  );

  if (error) return res.status(error.code).json([{ message: error.message }]);

  //@ts-ignore
  const reqUser = req.user;

  try {
    const user = await findByEmail(reqUser.email);
    if (!user) return res.status(404).json([{ message: 'User not found' }]);
    const recipes = await getLikedRecipes(
      user.id,
      skip,
      take,
      recipeWhereFields
    );
    const nextRecipes = await getLikedRecipes(
      user.id,
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

// GET: your latest recipes
recipeRouter.get('/your/latest', authToken, async (req, res) => {
  //@ts-ignore
  const user = req.user;

  try {
    const foundUser = await findByEmail(user.email);
    if (!foundUser) {
      return res.status(404).json([{ message: 'User not found' }]);
    }

    const recipes = await getYourLatestRecipes(foundUser.email, 3);

    if (recipes.length === 0) {
      return res.status(404).json([{ message: 'No recipes found' }]);
    }

    return res.status(200).json(recipes);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: recipe menu picker
recipeRouter.get('/pick', authToken, async (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json([{ message: 'No query provided' }]);

  try {
    const recipes = await getRecipesToPick(query);
    if (recipes.length === 0) {
      return res.status(404).json([{ message: 'No recipes found' }]);
    }
    return res.status(200).json(recipes);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: single recipe
recipeRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);

  try {
    const recipe = await getRecipe(id);
    if (!recipe) {
      return res.status(404).json([{ message: 'Recipe not found' }]);
    }

    return res.status(200).json({ ...recipe, isAuthor: false });
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: single recipe is liked
recipeRouter.get('/:id/liked', authToken, async (req, res) => {
  const { id } = req.params;

  //@ts-ignore
  const reqUser = req.user;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);

  try {
    const user = await findByEmail(reqUser.email);
    if (!user) {
      return res.status(404).json([{ message: 'User not found' }]);
    }

    const result = await getIsFavourite(id, user.id);

    return res.status(200).json(result ? true : false);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// GET: single recipe is author
recipeRouter.get('/:id/isAuthor', authToken, async (req, res) => {
  const { id } = req.params;

  //@ts-ignore;
  const reqUser = req.user;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);

  try {
    const recipe = await getRecipe(id);
    const user = await findByEmail(reqUser.email);

    if (!recipe) {
      return res.status(404).json([{ message: 'Recipe not found' }]);
    }

    if (!user) {
      return res.status(404).json([{ message: 'User not found' }]);
    }

    return res
      .status(200)
      .json({ ...recipe, isAuthor: user.id === recipe.userId });
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
    const { title, cookingTime, ingredients, instructions, types } = req.body;

    try {
      //@ts-ignore
      const user = req.user;
      const createdRecipe = await addRecipe(
        user.email,
        title,
        cookingTime,
        ingredients,
        instructions,
        types
      );

      return res.status(200).json(createdRecipe);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// POST: like recipe
recipeRouter.post('/:id/like', authToken, async (req, res) => {
  const { id } = req.params;

  //@ts-ignore
  const reqUser = req.user;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);
  try {
    const user = await findByEmail(reqUser.email);
    if (!user) return res.status(404).json([{ message: 'No user found' }]);
    const result = await likeRecipe(id, user.id);
    return res.status(200).json(result ? true : false);
  } catch (err: any) {
    if (err.message === 'Recipe is already liked') {
      return res.status(409).json([{ message: err.message }]);
    }
    return res.status(500).json([{ message: err.message }]);
  }
});

recipeRouter.delete('/:id/like', authToken, async (req, res) => {
  const { id } = req.params;

  //@ts-ignore
  const reqUser = req.user;

  if (!id) return res.status(400).json([{ message: 'No id specified' }]);
  try {
    const user = await findByEmail(reqUser.email);
    if (!user) return res.status(404).json([{ message: 'No user found' }]);
    const result = await dislikeRecipe(id, user.id);
    return res.status(200).json(result ? false : true);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// PATCH: update recipe thumbnail
recipeRouter.patch(
  '/:id/thumbnail',
  authToken,
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
      const foundRecipe = await getRecipe(recipeId);
      if (!foundRecipe) {
        return res
          .status(404)
          .json([{ message: 'No recipes found with following id' }]);
      }

      const updatedRecipe = await editRecipeThumbnail(recipeId, imgURL);

      return res.json(updatedRecipe);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// PUT: update recipe
recipeRouter.put(
  '/:id',
  validateSchema(createRecipeSchema),
  authToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      const newRecipe = await updateRecipe(
        id,
        req.body.title,
        req.body.cookingTime,
        req.body.ingredients,
        req.body.instructions,
        req.body.types
      );

      return res.status(200).json(newRecipe);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// DELETE: delete recipe
recipeRouter.delete('/:id', authToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await deleteRecipe(id);
    return res.status(200).json(deletedRecipe);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

function recipeSearchHandler(
  req: Request,
  requiresFiltersOrQuery: boolean = true
) {
  const query = req.query.q as string;
  const filters = req.query.filters as string;
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);

  let error = undefined;

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
    error = { code: 400, message: 'Skip/take is undefined' };
  }

  if (recipeWhereFields.length === 0 && requiresFiltersOrQuery) {
    error = { code: 404, message: 'No recipes found' };
  }

  return {
    skip,
    take,
    recipeWhereFields,
    error,
  };
}
