import prisma from '../utils/prisma';

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
  whereFields: object
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
          quantity: true,
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
