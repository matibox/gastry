import { Ingredient, RecipeType, RecipeTypeName } from '@prisma/client';
import prisma from '../utils/prisma';
import { findByEmail } from './user.services';

const recipeOverviewSelectFields = {
  id: true,
  title: true,
  cookingTime: true,
  thumbnail: true,
  updatedAt: true,
};

export async function latestRecipes(skip: number, take: number) {
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
    skip,
    take,
  });
}

export async function singleRecipe(id: string) {
  return await prisma.recipe.findUnique({
    select: {
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
      instructions: true,
      thumbnail: true,
    },
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

export async function addRecipeThumbnail(id: string, thumbnailURL: string) {
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
        {
          types: {
            some: {
              name: {
                in: ['vegetarian'],
              },
            },
          },
        },
        {
          user: {
            email,
          },
        },
      ],
    },
    skip,
    take,
  });
}
