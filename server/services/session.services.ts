import prisma from '../utils/prisma';

export async function createSession(userId: string) {
  const session = await prisma.session.findFirst({
    where: {
      userId,
      valid: true,
    },
  });

  if (session) throw new Error('You are already logged in!');

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

export async function invalidateSession(id: string) {
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) throw new Error('Session not found!');
  if (!session.valid) throw new Error('You are already logged out!');

  return await prisma.session.update({
    where: {
      id,
    },
    data: {
      valid: false,
    },
  });
}
