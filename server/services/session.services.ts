import prisma from '../utils/prisma';

export async function createSession(userId: string) {
  return await prisma.session.create({
    data: {
      valid: true,
      userId,
    },
  });
}

export async function getSession(id: string) {
  return await prisma.session.findUnique({
    where: {
      id,
    },
    select: {
      valid: true,
      user: {
        select: {
          role: true,
          email: true,
        },
      },
    },
  });
}
