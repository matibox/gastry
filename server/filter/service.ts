import prisma from '../utils/prisma';

export async function getFilters() {
  return await prisma.recipeType.findMany({
    distinct: ['name'],
    select: { name: true },
  });
}
