import { Prisma, PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const LOG_LEVELS = ['query', 'info', 'warn', 'error'];

const getPrismaClient = () => {
  if (process.env.VERCEL_ENV) {
    return new PrismaClient();
  }
  if (globalThis.prismaGlobal) return globalThis.prismaGlobal;

  const prismaOptions: Prisma.PrismaClientOptions = {
    log: LOG_LEVELS.map((level) => ({
      emit: 'stdout',
      level: level as Prisma.LogLevel
    })),
  };

  globalThis.prismaGlobal = new PrismaClient(prismaOptions);
  return globalThis.prismaGlobal;
};

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const db = getPrismaClient();

export { db };
