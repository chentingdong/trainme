import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

const getPrismaClient = (): PrismaClient => {
  if (process.env.VERCEL_ENV) {
    return new PrismaClient();
  }
  if (globalThis.prismaGlobal) return globalThis.prismaGlobal;
  globalThis.prismaGlobal = new PrismaClient();
  return globalThis.prismaGlobal;
};

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prisma = getPrismaClient();

export { prisma };