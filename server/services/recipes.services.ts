import { Ingredient, RecipeTypeName } from '@prisma/client';
import prisma from '../utils/prisma';
import { findByEmail } from './user.services';

const recipeOverviewSelectFields = {
  id: true,
  title: true,
  cookingTime: true,
  thumbnail: true,
  updatedAt: true,
};

const recipeSelectFields = {
  title: true,
  cookingTime: true,
  ingredients: {
    select: {
      id: true,
      name: true,
      value: true,
      unit: true,
    },
  },
  types: {
    select: {
      id: true,
      name: true,
    },
  },
  instructions: true,
  thumbnail: true,
  userId: true,
};

export async function getLatestRecipes(skip: number, take: number) {
  return await prisma.recipe.findMany({
    select: recipeOverviewSelectFields,
    orderBy: {
      updatedAt: 'desc',
    },
    skip,
    take,
  });
}

export async function searchRecipes(
  skip: number,
  take: number,
  whereFields: object[]
) {
  return await prisma.recipe.findMany({
    select: recipeOverviewSelectFields,
    where: {
      AND: whereFields,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    skip,
    take,
  });
}

export async function getRecipe(id: string) {
  return await prisma.recipe.findUnique({
    select: recipeSelectFields,
    where: {
      id,
    },
  });
}

export async function addRecipe(
  userEmail: string,
  title: string,
  cookingTime: number,
  ingredients: Ingredient[],
  instructions: string,
  types: RecipeTypeName[]
) {
  const user = await findByEmail(userEmail);
  if (!user) throw new Error('Bad user email');

  return await prisma.recipe.create({
    data: {
      userId: user.id,
      title,
      cookingTime,
      ingredients: {
        create: [
          ...ingredients.map(ingredient => ({
            ...ingredient,
            id: undefined,
          })),
        ],
      },
      instructions,
      types: {
        create: types.map(type => ({ name: type })),
      },
    },
    select: recipeOverviewSelectFields,
  });
}

export async function editRecipeThumbnail(id: string, thumbnailURL: string) {
  return await prisma.recipe.update({
    where: {
      id,
    },
    data: {
      thumbnail: thumbnailURL,
    },
    select: recipeOverviewSelectFields,
  });
}

export async function updateRecipe(
  id: string,
  title: string | undefined,
  cookingTime: number | undefined,
  ingredients: Ingredient[] | undefined,
  instructions: string | undefined,
  types: { id: string; name: string }[] | undefined
) {
  return await prisma.recipe.update({
    where: {
      id,
    },
    data: {
      title,
      cookingTime,
      ingredients: {
        deleteMany: {},
        connectOrCreate: ingredients?.map(ingredient => {
          return {
            where: { id: ingredient.id },
            create: {
              name: ingredient.name,
              value: ingredient.value,
              unit: ingredient.unit,
            },
          };
        }),
      },
      types: {
        deleteMany: {},
        connectOrCreate: types?.map(type => {
          return {
            where: {
              id: type.id,
            },
            create: {
              name: type.name as RecipeTypeName,
            },
          };
        }),
      },
      instructions,
    },
    select: recipeSelectFields,
  });
}

export async function deleteRecipe(id: string) {
  return await prisma.recipe.delete({
    where: {
      id,
    },
  });
}

export async function getYourRecipes(
  email: string,
  skip: number,
  take: number,
  whereFields: object[]
) {
  return await prisma.recipe.findMany({
    select: recipeOverviewSelectFields,
    where: {
      AND: [
        ...whereFields,
        {
          user: {
            email,
          },
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
    skip,
    take,
  });
}

export async function getYourLatestRecipes(email: string, quantity: number) {
  return await prisma.recipe.findMany({
    select: recipeOverviewSelectFields,
    where: {
      user: {
        email,
      },
    },
    skip: 0,
    take: quantity,
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getRecipesToPick(query: string) {
  return await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
    },
    where: {
      title: {
        contains: query,
      },
    },
    take: 15,
  });
}
