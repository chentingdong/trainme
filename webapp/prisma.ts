import { PrismaClient } from '@prisma/client';
import type { workout as Workout } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const globalForPrisma = global as unknown as { prisma: PrismaClient; };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const defaultWorkout: Workout = {
  id: uuidv4(),
  type: '',
  sport_type: '',
  name: 'Base run',
  description: '',
  steps: ['10m Z1'],
  distance: null,
  duration: null
};

export const emptyWorkout: Workout = {
  id: uuidv4(),
  type: '',
  sport_type: '',
  name: '',
  description: '',
  steps: [],
  distance: null,
  duration: null
};