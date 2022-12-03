import { RegisterUserInput } from '../schemas/user.schema';
import prisma from '../utils/prisma';

export async function createUser(input: RegisterUserInput) {
  const userData = input.body;
  return await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: 'user',
    },
  });
}

export async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function addRefreshToken(token: string) {
  return await prisma.refreshToken.create({
    data: {
      token,
    },
  });
}

export async function getRefreshToken(token: string) {
  return await prisma.refreshToken.findFirst({
    where: {
      token,
    },
  });
}

export async function removeRefreshToken(token: string) {
  return await prisma.refreshToken.deleteMany({
    where: {
      token,
    },
  });
}
