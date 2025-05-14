import 'server-only';
import { prisma } from '@/lib/prisma';

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
