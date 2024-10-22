import { Prisma, PrismaClient, Workout } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export * from '@prisma/client';

const LOG_LEVELS: Prisma.LogLevel[] = ['warn', 'error'];

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

// TODO: These should either in the db or somewhere hold all constants
export const defaultWorkout: Workout = {
  id: uuidv4(),
  name: "Base run",
  description: "",
  steps: ["10m Z1"],
  distance: null,
  duration: null,
  sportType: "Run",
};

export const emptyWorkout: Workout = {
  id: uuidv4(),
  name: "",
  description: "",
  steps: [],
  distance: null,
  duration: null,
  sportType: "",
};
