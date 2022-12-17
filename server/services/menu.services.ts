import { TimeOfDays, WeekDays } from '@prisma/client';
import prisma from '../utils/prisma';

const days: { name: WeekDays; order: number }[] = [
  { name: 'monday', order: 0 },
  { name: 'tuesday', order: 1 },
  { name: 'wednesday', order: 2 },
  { name: 'thrusday', order: 3 },
  { name: 'friday', order: 4 },
  { name: 'saturday', order: 5 },
  { name: 'sunday', order: 6 },
];

const timesOfDay: { name: TimeOfDays; order: number }[] = [
  { name: 'morning', order: 0 },
  { name: 'before_noon', order: 1 },
  { name: 'noon', order: 2 },
  { name: 'afternoon', order: 3 },
  { name: 'evening', order: 4 },
];

export async function getMenus(userId: string) {
  return await prisma.menu.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      days: {
        select: {
          id: true,
          name: true,
          timeOfDays: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      updatedAt: 'asc',
    },
  });
}

export async function addMenu(userId: string, title: string) {
  const createdMenu = await prisma.menu.create({
    data: {
      name: title,
      userId,
      days: {
        createMany: {
          data: days,
        },
      },
    },
    select: {
      id: true,
      days: {
        select: {
          id: true,
        },
      },
    },
  });

  createdMenu.days.forEach(async day => {
    await prisma.timeOfDay.createMany({
      data: timesOfDay.map(time => ({ ...time, dayId: day.id })),
    });
  });

  return await prisma.menu.findUnique({
    where: {
      id: createdMenu.id,
    },
    select: {
      id: true,
      name: true,
      days: {
        select: {
          id: true,
          name: true,
          timeOfDays: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

export async function editMenu(menuId: string, newName: string) {
  return await prisma.menu.update({
    where: {
      id: menuId,
    },
    data: {
      name: newName,
    },
    select: {
      id: true,
      name: true,
      days: {
        select: {
          id: true,
          name: true,
          timeOfDays: {
            select: {
              id: true,
              name: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}
