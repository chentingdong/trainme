import { PrismaClient } from '@prisma/client';
import { workout as Workout } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient; };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


export const defaultWorkout: Workout = {
  id: 0,
  type: 'Run',
  sport_type: null,
  name: '',
  description: '',
  workout: JSON.stringify(['10m Z1', '10m Z2', '10m Z1']),
};