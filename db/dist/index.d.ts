import { Prisma, PrismaClient } from '@prisma/client';
export * from '@prisma/client';
declare const db: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { db };
