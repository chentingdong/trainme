import { Prisma, PrismaClient, Workout } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export * from '@prisma/client';

const LOG_LEVELS: Prisma.LogLevel[] = ['query', 'info', 'warn', 'error'];

const getPrismaClient = () => {
  if (process.env.VERCEL_ENV) {
    return new PrismaClient();
  }
  if (globalThis.prismaGlobal) return globalThis.prismaGlobal;

  const prismaOptions: Prisma.PrismaClientOptions = {
    log: LOG_LEVELS
  };
  globalThis.prismaGlobal = new PrismaClient(prismaOptions);
  return globalThis.prismaGlobal;
};

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const db = getPrismaClient();

export { db };

export const defaultWorkout: Workout = {
  id: '',
  name: '',
  date: new Date(),
  description: "",
  sportType: "Run",
  distance: null,
  duration: null,
  steps: [''],
  feeling: null,
  rpe: null,
  notes: null,
  activityUuid: null,
  athleteId: 0,
};

