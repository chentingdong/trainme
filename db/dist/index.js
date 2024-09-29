import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
const getPrismaClient = () => {
    if (process.env.VERCEL_ENV) {
        return new PrismaClient();
    }
    if (globalThis.prismaGlobal)
        return globalThis.prismaGlobal;
    globalThis.prismaGlobal = new PrismaClient();
    return globalThis.prismaGlobal;
};
const prisma = getPrismaClient();
export { prisma };
//# sourceMappingURL=index.js.map