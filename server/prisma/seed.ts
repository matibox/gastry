import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipeType.deleteMany();
  const user1 = await prisma.user.create({
    data: {
      email: 'john@prisma.io',
      name: 'John',
      password: 'test12345',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: 'test12345',
    },
  });

  const recipe1 = await prisma.recipe.create({
    data: {
      cookingTime: 35,
      title: 'Vegetable salad with wheat bread',
      instructions:
        'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed finibusconsequat dui. Etiam tempor facilisisblandit. Praesent id mattis turpis.Lorem ipsum dolor sit amet,consectetur adipiscing elit. Praesentturpis ante, pharetra a risus non,ultricies commodo lacus. Maecenaslacinia tortor at mattis vulputate.Donec nibh justo, vestibulumvitae mi semper, posuere pellentesquediam. Pellentesque fermentum lorem risus.',
      ingredients: {
        create: [
          {
            name: 'salad',
            value: 500,
            unit: 'g',
          },
          {
            name: 'wheat bread',
            value: 2,
            unit: 'slices',
          },
        ],
      },
      userId: user1.id,
      thumbnail:
        'https://res.cloudinary.com/drjsjdeff/image/upload/v1691234058/pexels-photo-1213710_fxm1mz.jpg',
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      cookingTime: 120,
      title: 'Pizza',
      instructions:
        'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed finibusconsequat dui. Etiam tempor facilisisblandit. Praesent id mattis turpis.Lorem ipsum dolor sit amet,consectetur adipiscing elit. Praesentturpis ante, pharetra a risus non,ultricies commodo lacus. Maecenaslacinia tortor at mattis vulputate.Donec nibh justo, vestibulumvitae mi semper, posuere pellentesquediam. Pellentesque fermentum lorem risus.',
      ingredients: {
        create: [
          {
            name: 'flour',
            value: 500,
            unit: 'g',
          },
          {
            name: 'tomato sauce',
            value: 250,
            unit: 'ml',
          },
        ],
      },
      userId: user2.id,
      thumbnail:
        'https://res.cloudinary.com/drjsjdeff/image/upload/v1691234130/Pizza_with_tomatoes_mihw3w.jpg',
      types: {
        create: [
          {
            name: 'vegetarian',
          },
          {
            name: 'spicy',
          },
        ],
      },
    },
  });

  await prisma.favourite.createMany({
    data: [
      {
        userId: user1.id,
        recipeId: recipe1.id,
      },
      {
        userId: user2.id,
        recipeId: recipe2.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
