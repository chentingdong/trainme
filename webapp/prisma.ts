import { PrismaClient } from '@prisma/client';
import type { workout as Workout } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient; };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const defaultWorkout: Workout = {
  id: 0, // This is a placeholder value
  type: 'Run',
  sport_type: 'Running',
  name: 'Base run',
  description: 'default workout',
  workout: '[]',
};