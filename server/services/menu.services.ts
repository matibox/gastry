import { TimeOfDays, WeekDays } from '@prisma/client';
import prisma from '../utils/prisma';

const days: { name: WeekDays }[] = [
  { name: 'monday' },
  { name: 'tuesday' },
  { name: 'wednesday' },
  { name: 'thrusday' },
  { name: 'friday' },
  { name: 'saturday' },
  { name: 'sunday' },
];

const timesOfDay: { name: TimeOfDays }[] = [
  { name: 'morning' },
  { name: 'before_noon' },
  { name: 'noon' },
  { name: 'afternoon' },
  { name: 'evening' },
];

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
    include: {
      days: {
        include: {
          timeOfDays: true,
        },
      },
    },
  });

  createdMenu.days.forEach(async (day, i) => {
    await prisma.timeOfDay.createMany({
      data: {
        dayId: day.id,
        name: timesOfDay[i].name,
      },
    });
  });

  return createdMenu;
}
