import { PrismaClient } from '@prisma/client';
import type { workout as Workout } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const globalForPrisma = global as unknown as { prisma: PrismaClient; };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const defaultWorkout: Workout = {
  id: uuidv4(),
  type: '',
  sport_type_id: 1,
  name: '',
  description: '',
  steps: [],
  distance: null,
  duration: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};